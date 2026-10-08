import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

/**
 * Translations live in `src/locales/<code>.json` (one flat file per language).
 *
 * - Keys are the English source strings, so `en.json` is both the reference and the fallback.
 * - Every locale file carries a `_meta.name` entry: the language name shown in the language picker.
 * - A missing or empty translation falls back to English.
 *
 * To add a language, copy `en.json` to `<code>.json`, set `_meta.name`, and translate the values.
 * No other file needs to be touched. See docs/developers/translating.md.
 */

type LocaleFile = { _meta?: { name?: string }; [key: string]: unknown }

const modules = import.meta.glob<LocaleFile>('../locales/*.json', {
  eager: true,
  import: 'default'
})

export const FALLBACK_LANGUAGE = 'en'
export const LANGUAGE_STORAGE_KEY = 'flowsint-language'

const resources: Record<string, { translation: Record<string, unknown> }> = {}
const names: Record<string, string> = {}

for (const [path, content] of Object.entries(modules)) {
  const code = path.split('/').pop()!.replace('.json', '')
  const { _meta, ...translation } = content
  resources[code] = { translation }
  names[code] = _meta?.name ?? code
}

export const availableLanguages = Object.keys(resources)
  .sort((a, b) => (a === FALLBACK_LANGUAGE ? -1 : b === FALLBACK_LANGUAGE ? 1 : a.localeCompare(b)))
  .map((code) => ({ code, name: names[code] }))

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: Object.keys(resources),
    fallbackLng: FALLBACK_LANGUAGE,
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    // Keys are natural-language English sentences: don't split them on '.' or ':'.
    keySeparator: false,
    nsSeparator: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage']
    }
  })

document.documentElement.lang = i18n.resolvedLanguage ?? FALLBACK_LANGUAGE

/** Translate an English source string. Safe to call from anywhere (components, stores, hooks). */
export const t = i18n.t.bind(i18n)

/**
 * Switch language. Many labels are computed at module load time, so the page is reloaded
 * to guarantee that every string is rendered in the new language.
 */
export async function changeLanguage(code: string) {
  await i18n.changeLanguage(code)
  window.location.reload()
}

export default i18n
