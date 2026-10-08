import { Extension } from '@tiptap/core'
import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, ReactRenderer } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { SlashCommandList } from './slash-command-list'
import type { SlashCommandListRef } from './slash-command-list'

export interface SlashCommandItem {
  title: string
  description: string
  category: string
  icon: string
  command: (editor: Editor) => void
}

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to)
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()]
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

const slashCommandItems: SlashCommandItem[] = [
  {
    title: 'Заголовок 1',
    description: 'Крупный заголовок раздела',
    category: 'Hierarchy',
    icon: 'Heading1',
    command: (editor) => editor.chain().focus().setHeading({ level: 1 }).run()
  },
  {
    title: 'Заголовок 2',
    description: 'Средний заголовок раздела',
    category: 'Hierarchy',
    icon: 'Heading2',
    command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run()
  },
  {
    title: 'Заголовок 3',
    description: 'Мелкий заголовок раздела',
    category: 'Hierarchy',
    icon: 'Heading3',
    command: (editor) => editor.chain().focus().setHeading({ level: 3 }).run()
  },
  {
    title: 'Маркированный список',
    description: 'Создать простой маркированный список',
    category: 'Lists',
    icon: 'List',
    command: (editor) => editor.chain().focus().toggleBulletList().run()
  },
  {
    title: 'Нумерованный список',
    description: 'Создать нумерованный список',
    category: 'Lists',
    icon: 'ListOrdered',
    command: (editor) => editor.chain().focus().toggleOrderedList().run()
  },
  {
    title: 'Список задач',
    description: 'Создать чек-лист задач',
    category: 'Lists',
    icon: 'ListTodo',
    command: (editor) => editor.chain().focus().toggleTaskList().run()
  },
  {
    title: 'Цитата',
    description: 'Добавить блок цитаты',
    category: 'Blocks',
    icon: 'Quote',
    command: (editor) => editor.chain().focus().toggleBlockquote().run()
  },
  {
    title: 'Блок кода',
    description: 'Добавить фрагмент кода',
    category: 'Blocks',
    icon: 'Code',
    command: (editor) => editor.chain().focus().toggleCodeBlock().run()
  },
  {
    title: 'Разделитель',
    description: 'Добавить горизонтальный разделитель',
    category: 'Blocks',
    icon: 'Minus',
    command: (editor) => editor.chain().focus().setHorizontalRule().run()
  },
  {
    title: 'Изображение',
    description: 'Загрузить или встроить изображение',
    category: 'Media',
    icon: 'ImageIcon',
    command: (editor) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = () => {
        const file = input.files?.[0]
        if (file) {
          const blobUrl = URL.createObjectURL(file)
          editor.commands.insertContent({
            type: 'image',
            attrs: {
              src: blobUrl,
              alt: file.name,
              title: file.name
            }
          })
        }
      }
      input.click()
    }
  }
]

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        items: ({ query }: { query: string }): SlashCommandItem[] => {
          return slashCommandItems.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase())
          )
        },
        render: () => {
          let component: ReactRenderer<SlashCommandListRef> | undefined

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor
              })
              if (!props.clientRect) return

              const element = component.element as HTMLElement
              element.style.position = 'absolute'
              element.style.zIndex = '9999'
              document.body.appendChild(element)
              updatePosition(props.editor, element)
            },

            onUpdate(props: SuggestionProps) {
              if (!component) return
              component.updateProps(props)
              if (!props.clientRect) return

              const element = component.element as HTMLElement
              updatePosition(props.editor, element)
            },

            onKeyDown(props: { event: KeyboardEvent }) {
              if (props.event.key === 'Escape') {
                component?.destroy()
                return true
              }
              return component?.ref?.onKeyDown(props) ?? false
            },

            onExit() {
              if (!component) return
              component.element.remove()
              component.destroy()
            }
          }
        },
        command: ({
          editor,
          range,
          props
        }: {
          editor: Editor
          range: { from: number; to: number }
          props: SlashCommandItem
        }) => {
          editor.chain().focus().deleteRange(range).run()
          props.command(editor)
        }
      } as Partial<SuggestionOptions>
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ]
  }
})

export default SlashCommand
