#!/usr/bin/env node
/**
 * Translation helper.
 *
 *   yarn i18n:sync            Add keys found in the code to every locale file (missing ones are left
 *                             empty, so they fall back to English). Reports keys no longer used.
 *   yarn i18n:sync --prune    Same, and also remove keys that are no longer used in the code.
 *   yarn i18n:check           Verify locale files: every key used in the code exists in en.json,
 *                             placeholders ({{name}}) and tags (<b>…</b>) match the source, and plural
 *                             forms are valid. Prints the translation coverage of each language.
 *
 * Keys are the English source strings: t('Hello {{name}}', { name }). Strings passed with a `count`
 * option (or a `count` prop on <Trans>) are plurals and get one entry per plural form of each
 * language: "<key>_one", "<key>_other", ... (see https://www.i18next.com/translation-function/plurals).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
const LOCALES = join(SRC, 'locales')
const FALLBACK = 'en'

const args = new Set(process.argv.slice(3))
const command = process.argv[2]

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, files)
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\./.test(name)) files.push(path)
  }
  return files
}

const stringValue = (node) =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null

/** Collect every translation key used in the source, with its location and plural flag. */
function extractKeys() {
  const keys = new Map() // key -> { plural, where: [] }
  const add = (key, plural, file, node, sf) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
    const entry = keys.get(key) ?? { plural: false, where: [] }
    entry.plural ||= plural
    entry.where.push(`${relative(ROOT, file)}:${line + 1}`)
    keys.set(key, entry)
  }

  for (const file of walk(SRC)) {
    const sf = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    )
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const callee = node.expression.getText(sf)
        if (callee === 't' || callee === 'i18n.t') {
          const key = stringValue(node.arguments[0])
          if (key) {
            const options = node.arguments[1]
            const plural =
              !!options &&
              ts.isObjectLiteralExpression(options) &&
              options.properties.some((p) => p.name && p.name.getText(sf) === 'count')
            add(key, plural, file, node, sf)
          }
        }
      }
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        if (node.tagName.getText(sf) === 'Trans') {
          let key = null
          let plural = false
          for (const attr of node.attributes.properties) {
            if (!ts.isJsxAttribute(attr)) continue
            const name = attr.name.getText(sf)
            if (name === 'count') plural = true
            if (name === 'i18nKey' && attr.initializer) {
              key = ts.isJsxExpression(attr.initializer)
                ? stringValue(attr.initializer.expression)
                : stringValue(attr.initializer)
            }
          }
          if (key) add(key, plural, file, node, sf)
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
  return keys
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const writeJson = (path, data) => writeFileSync(path, JSON.stringify(data, null, 2) + '\n')

function localeFiles() {
  return readdirSync(LOCALES)
    .filter((f) => f.endsWith('.json'))
    .map((f) => basename(f, '.json'))
    .sort((a, b) => (a === FALLBACK ? -1 : b === FALLBACK ? 1 : a.localeCompare(b)))
}

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/
const pluralForms = (lang) => new Intl.PluralRules(lang).resolvedOptions().pluralCategories
const placeholders = (s) => [...s.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]).sort()
const tags = (s) => [...s.matchAll(/<\/?[A-Za-z][\w-]*\s*\/?>/g)].map((m) => m[0]).sort()
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/** Entries a locale must have for the given keys: plain keys, or one per plural form. */
function expectedEntries(keys, lang) {
  const out = []
  for (const [key, { plural }] of keys) {
    if (plural) for (const form of pluralForms(lang)) out.push([`${key}_${form}`, key])
    else out.push([key, key])
  }
  return out
}

function sync() {
  const keys = extractKeys()
  const prune = args.has('--prune')
  let changed = false

  for (const lang of localeFiles()) {
    const path = join(LOCALES, `${lang}.json`)
    const current = readJson(path)
    const { _meta, ...entries } = current
    const expected = new Map(expectedEntries(keys, lang))
    const next = {}
    let added = 0

    for (const [entryKey, baseKey] of expected) {
      if (entryKey in entries) next[entryKey] = entries[entryKey]
      else {
        // English entries are their own source text; other languages start empty (= fallback).
        next[entryKey] = lang === FALLBACK ? baseKey : ''
        added++
      }
    }
    const unused = Object.keys(entries).filter((k) => !expected.has(k))
    if (!prune) for (const k of unused) next[k] = entries[k]

    const sorted = Object.fromEntries(
      Object.entries(next).sort(([a], [b]) => a.localeCompare(b, 'en'))
    )
    const result = { _meta: _meta ?? { name: lang }, ...sorted }
    if (JSON.stringify(result) !== JSON.stringify(current)) {
      writeJson(path, result)
      changed = true
    }
    console.log(
      `${lang}: +${added} added, ${unused.length} unused${prune && unused.length ? ' (removed)' : ''}`
    )
    if (unused.length && !prune) console.log('   run with --prune to remove unused keys')
  }
  if (!changed) console.log('Nothing to update.')
}

function check() {
  const keys = extractKeys()
  const errors = []
  const report = []

  for (const lang of localeFiles()) {
    const { _meta, ...entries } = readJson(join(LOCALES, `${lang}.json`))
    if (!_meta?.name) errors.push(`${lang}.json: missing "_meta": { "name": "…" }`)
    const expected = expectedEntries(keys, lang)
    let translated = 0

    for (const [entryKey, baseKey] of expected) {
      const value = entries[entryKey]
      if (value === undefined) {
        errors.push(`${lang}.json: missing key "${entryKey}"`)
        continue
      }
      if (value === '') continue
      translated++
      const isPlural = PLURAL_SUFFIX.test(entryKey) && entryKey !== baseKey
      const want = placeholders(baseKey)
      const got = placeholders(value)
      // A plural form may omit {{count}} ("one" in many languages is written as a word).
      const okPlaceholders = isPlural
        ? same(
            got.filter((p) => p !== 'count'),
            want.filter((p) => p !== 'count')
          )
        : same(got, want)
      if (!okPlaceholders)
        errors.push(
          `${lang}.json: placeholders differ in "${entryKey}": expected {{${want.join('}}, {{')}}}`
        )
      if (!same(tags(value), tags(baseKey)))
        errors.push(
          `${lang}.json: tags differ in "${entryKey}": expected ${tags(baseKey).join(' ')}`
        )
    }
    const total = expected.length
    report.push(
      `${lang.padEnd(6)} ${String(translated).padStart(5)} / ${total}  ${Math.round((translated / total) * 100)}%  ${_meta?.name ?? ''}`
    )
  }

  console.log(`${keys.size} translation keys used in the code\n`)
  console.log(report.join('\n'))
  if (errors.length) {
    console.error(`\n${errors.length} problem(s):`)
    for (const e of errors.slice(0, 50)) console.error(' - ' + e)
    if (errors.length > 50) console.error(` … and ${errors.length - 50} more`)
    console.error('\nRun `yarn i18n:sync` to add missing keys.')
    process.exit(1)
  }
  console.log('\nOK')
}

if (command === 'sync') sync()
else if (command === 'check') check()
else {
  console.error('Usage: node scripts/i18n.mjs <sync [--prune] | check>')
  process.exit(2)
}
