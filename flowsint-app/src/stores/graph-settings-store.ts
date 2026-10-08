import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Shape shared by every entry under a settings category (general/graph).
// `value` is number|boolean because that's every value that exists today —
// widen this union if a string- or array-valued setting is ever added.
export interface SettingItem {
  name: string
  type: string
  value: number | boolean
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
  description?: string
}

// Centralized default settings organized by categories
const DEFAULT_SETTINGS = {
  information: {},
  general: {
    showFlow: {
      name: 'Показывать ассистента потока',
      type: 'boolean',
      value: false,
      description: 'Показать Flo, вашего ИИ-ассистента.'
    },
    autoZoomOnCurrentNode: {
      name: 'Автомасштаб при выборе узла',
      type: 'boolean',
      value: true,
      description: 'Автоматически приближать к текущему узлу при его смене.'
    },
    showMinimap: {
      name: 'Показывать миникарту',
      type: 'boolean',
      value: true,
      description: 'Показывать миникарту графа.'
    },
    showBackground: {
      name: 'Показывать фон',
      type: 'boolean',
      value: true,
      description: 'Показывать точечный фон на графе.'
    },
    autoColorLinksByNodeType: {
      name: 'Автоцвет связей по типу узла',
      type: 'boolean',
      value: true,
      description: 'Автоматически окрашивать связи по типу целевого узла.'
    }
  },
  graph: {
    nodeOutlined: {
      name: 'Стиль узла (контур/заливка)',
      type: 'boolean',
      value: false,
      description: 'Стиль узла, по умолчанию с заливкой.'
    },
    dotStyle: {
      name: 'Стиль узла (точка/карточка)',
      type: 'boolean',
      value: true,
      description: 'Стиль узла: точка или карточка.'
    },
    nodeSize: {
      name: 'Размер узла',
      type: 'number',
      value: 30,
      min: 0.2,
      max: 100,
      step: 0.1,
      description: 'Определяет толщину связи между двумя узлами.'
    },
    nodeWeightMultiplierSize: {
      name: 'Множитель веса узла',
      type: 'number',
      value: 1.2,
      min: 0.1,
      max: 8.0,
      step: 0.01,
      description: 'Определяет, как размер узла зависит от веса (числа связей).'
    },
    linkWidth: {
      name: 'Толщина связей',
      type: 'number',
      value: 0.8,
      min: 0.3,
      max: 10,
      step: 0.05,
      description: 'Определяет толщину связи между двумя узлами.'
    },
    nodeLabelFontSize: {
      name: 'Размер шрифта подписей узлов',
      type: 'number',
      value: 60,
      min: 10,
      max: 200,
      step: 5,
      description:
        'Размер шрифта подписей узлов (в процентах от базового, масштабируется с зумом)'
    },
    linkLabelFontSize: {
      name: 'Размер шрифта подписей связей',
      type: 'number',
      value: 60,
      min: 10,
      max: 200,
      step: 5,
      description:
        'Размер шрифта подписей связей (в процентах от базового, масштабируется с зумом)'
    },
    linkLabelHorizontal: {
      name: 'Горизонтальные подписи связей',
      type: 'boolean',
      value: false,
      description: 'Показывать подписи связей горизонтально, а не вдоль угла ребра.'
    },
    dagLevelDistance: {
      name: 'Расстояние между уровнями DAG',
      type: 'number',
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      description:
        'Расстояние между уровнями глубины графа в режиме раскладки DAG (ориентированный ациклический граф)'
    },
    d3ForceChargeStrength: {
      name: 'Сила заряда',
      type: 'number',
      value: -150,
      min: -500,
      max: 0,
      step: 5,
      description:
        'Базовая сила отталкивания (адаптивная: сильно связанные узлы и центры кластеров отталкиваются в 2–3 раза сильнее, чтобы разделять кластеры)'
    },
    d3ForceLinkDistance: {
      name: 'Расстояние связей',
      type: 'number',
      value: 35,
      min: 10,
      max: 200,
      step: 1,
      description: 'Целевое расстояние между связанными узлами (больше = дальше друг от друга)'
    },
    d3ForceLinkStrength: {
      name: 'Сила связей',
      type: 'number',
      value: 1.0,
      min: 0,
      max: 2,
      step: 0.1,
      description:
        'Сила связей, удерживающих целевое расстояние (больше = плотнее кластеры, меньше = слабее)'
    },
    linkDirectionalArrowRelPos: {
      name: 'Относительное положение стрелки',
      type: 'number',
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
      description:
        'Положение стрелок направления вдоль связи (0 = исходный узел, 1 = целевой узел, 0.5 = середина)'
    },
    linkDirectionalArrowLength: {
      name: 'Длина стрелки',
      type: 'number',
      value: 1.2,
      min: 1,
      max: 10,
      step: 0.1,
      description: 'Длина наконечников стрелок, показывающих направление связи'
    },
    linkDirectionalParticleSpeed: {
      name: 'Скорость частиц',
      type: 'number',
      value: 0.005,
      min: 0,
      max: 0.05,
      step: 0.001,
      description: 'Скорость движения частиц по связям (больше = быстрее)'
    },
    cooldownTicks: {
      name: 'Тики остывания',
      type: 'number',
      value: 200,
      min: 50,
      max: 1000,
      step: 10,
      description: 'Число кадров симуляции до остановки и фиксации раскладки'
    },
    cooldownTime: {
      name: 'Время остывания',
      type: 'number',
      value: 15000,
      min: 1000,
      max: 60000,
      step: 1000,
      description:
        'Максимальное время работы симуляции в миллисекундах (15000 = 15 секунд)'
    },
    d3AlphaDecay: {
      name: 'Затухание альфа',
      type: 'number',
      value: 0.06,
      min: 0,
      max: 0.3,
      step: 0.005,
      description:
        'Скорость затухания интенсивности симуляции (больше = быстрее сходится, меньше = дольше работает)'
    },
    d3AlphaMin: {
      name: 'Минимум альфа',
      type: 'number',
      value: 0.001,
      min: 0,
      max: 0.1,
      step: 0.001,
      description:
        'Минимальный порог интенсивности симуляции — симуляция останавливается при его достижении'
    },
    d3VelocityDecay: {
      name: 'Затухание скорости',
      type: 'number',
      value: 0.75,
      min: 0,
      max: 1,
      step: 0.01,
      description:
        'Коэффициент затухания скорости, имитирующий трение (больше = сильнее торможение, узлы замедляются быстрее)'
    },
    collisionRadius: {
      name: 'Радиус столкновений',
      type: 'number',
      value: 22,
      min: 10,
      max: 50,
      step: 1,
      description:
        'Радиус обнаружения столкновений вокруг узлов (не даёт узлам перекрываться и улучшает читаемость)'
    },
    collisionStrength: {
      name: 'Сила столкновений',
      type: 'number',
      value: 0.95,
      min: 0,
      max: 1,
      step: 0.05,
      description: 'Сила столкновений (1 = полностью жёсткие, 0 = без столкновений)'
    },
    centerGravity: {
      name: 'Гравитация к центру',
      type: 'number',
      value: 0.15,
      min: 0,
      max: 1,
      step: 0.05,
      description:
        'Сила притяжения всех узлов к центру (не даёт кластерам разлетаться, больше = сильнее притяжение)'
    }
    // warmupTicks: {
    //   type: 'number',
    //   value: 0,
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   description:
    //     'Number of simulation cycles to run in background before starting to render (improves initial layout)'
    // }
  }
}

// Force Presets - Include all relevant force simulation parameters
const FORCE_PRESETS = {
  'Tight Clusters': {
    d3AlphaDecay: 0.1,
    d3AlphaMin: 0.001,
    d3VelocityDecay: 0.8,
    d3ForceChargeStrength: -50,
    d3ForceLinkDistance: 10,
    d3ForceLinkStrength: 2,
    cooldownTicks: 300,
    cooldownTime: 20000,
    collisionRadius: 15,
    collisionStrength: 0.7,
    centerGravity: 0.2
  },
  'Compact Network': {
    d3AlphaDecay: 0.08,
    d3AlphaMin: 0.001,
    d3VelocityDecay: 0.7,
    d3ForceChargeStrength: -80,
    d3ForceLinkDistance: 20,
    d3ForceLinkStrength: 2,
    cooldownTicks: 250,
    cooldownTime: 18000,
    collisionRadius: 18,
    collisionStrength: 0.75,
    centerGravity: 0.18
  },
  'Balanced Layout': {
    d3AlphaDecay: 0.06,
    d3AlphaMin: 0,
    d3VelocityDecay: 0.6,
    d3ForceChargeStrength: -120,
    d3ForceLinkDistance: 30,
    d3ForceLinkStrength: 2,
    cooldownTicks: 200,
    cooldownTime: 15000,
    collisionRadius: 22,
    collisionStrength: 0.8,
    centerGravity: 0.15
  },
  'Loose Organic': {
    d3AlphaDecay: 0.04,
    d3AlphaMin: 0,
    d3VelocityDecay: 0.4,
    d3ForceChargeStrength: -200,
    d3ForceLinkDistance: 30,
    d3ForceLinkStrength: 2,
    cooldownTicks: 150,
    cooldownTime: 12000,
    collisionRadius: 25,
    collisionStrength: 0.85,
    centerGravity: 0.12
  },
  'High Energy': {
    d3AlphaDecay: 0.02,
    d3AlphaMin: 0,
    d3VelocityDecay: 0.3,
    d3ForceChargeStrength: -300,
    d3ForceLinkDistance: 20,
    d3ForceLinkStrength: 2,
    cooldownTicks: 100,
    cooldownTime: 10000,
    collisionRadius: 20,
    collisionStrength: 0.8,
    centerGravity: 0.25
  },
  'Readable clusters': {
    d3AlphaDecay: 0.06,
    d3AlphaMin: 0.001,
    d3VelocityDecay: 0.75,
    d3ForceChargeStrength: -150,
    d3ForceLinkDistance: 35,
    d3ForceLinkStrength: 1.0,
    cooldownTicks: 300,
    cooldownTime: 20000,
    collisionRadius: 22,
    collisionStrength: 0.95,
    centerGravity: 0.15
  },
  'Medium spacing': {
    d3AlphaDecay: 0.055,
    d3AlphaMin: 0.001,
    d3VelocityDecay: 0.7,
    d3ForceChargeStrength: -200,
    d3ForceLinkDistance: 40,
    d3ForceLinkStrength: 0.8,
    cooldownTicks: 320,
    cooldownTime: 22000,
    collisionRadius: 26,
    collisionStrength: 0.9,
    centerGravity: 0.2
  },
  'Osint friendly': {
    d3AlphaDecay: 0.07,
    d3AlphaMin: 0.001,
    d3VelocityDecay: 0.8,
    d3ForceChargeStrength: -100,
    d3ForceLinkDistance: 28,
    d3ForceLinkStrength: 1.4,
    cooldownTicks: 280,
    cooldownTime: 18000,
    collisionRadius: 18,
    collisionStrength: 1.0,
    centerGravity: 0.25
  }
}

// This is exactly `DEFAULT_SETTINGS.graph`'s type — the store assigns it
// directly as the initial value below.
export type GraphForceSettings = typeof DEFAULT_SETTINGS.graph

type GraphGeneralSettingsStore = {
  // Settings state
  settings: typeof DEFAULT_SETTINGS
  forceSettings: GraphForceSettings
  updateSetting: (category: string, key: string, value: number | boolean) => void
  resetSettings: () => void
  getSettings: () => Record<string, number | boolean>
  getCategorySettings: (category: string) => Record<string, number | boolean>

  // Force Presets
  currentPreset: string | null
  applyPreset: (presetName: string) => void
  getPresets: () => typeof FORCE_PRESETS

  // UI State
  settingsModalOpen: boolean
  setSettingsModalOpen: (open: boolean) => void
  toggleSettingsModal: () => void
  keyboardShortcutsOpen: boolean
  setKeyboardShortcutsOpen: (open: boolean) => void
  toggleKeyboardShortcutsModal: () => void
  importModalOpen: boolean
  setImportModalOpen: (open: boolean) => void

  // Helper methods
  getSettingValue: (category: string, key: string) => number | boolean | undefined
  getSettingType: (category: string, key: string) => string | undefined
  getSettingName: (category: string, key: string) => string | undefined
  getSettingOptions: (
    category: string,
    key: string
  ) => { value: string; label: string }[] | undefined
  getSettingDescription: (category: string, key: string) => string | undefined
  getSettingConstraints: (
    category: string,
    key: string
  ) => { min?: number; max?: number; step?: number } | undefined
}

// Storage version - increment this whenever you make breaking changes to DEFAULT_SETTINGS
const STORAGE_VERSION = 8

export const useGraphSettingsStore = create<GraphGeneralSettingsStore>()(
  persist(
    (set, get) => ({
      // Settings state
      settings: DEFAULT_SETTINGS,
      currentPreset: 'High Energy',
      forceSettings: DEFAULT_SETTINGS.graph,
      // UI State
      settingsModalOpen: false,
      keyboardShortcutsOpen: false,
      importModalOpen: false,
      // Core methods
      updateSetting: (category, key, value) =>
        set((state) => {
          const categorySettings = state.settings[
            category as keyof typeof state.settings
          ] as Record<string, SettingItem>
          const newSettings = {
            ...state.settings,
            [category]: {
              ...categorySettings,
              [key]: {
                ...(categorySettings?.[key] || {}),
                value: value
              }
            }
          }
          // Also update forceSettings if we're updating a graph setting
          let newForceSettings = state.forceSettings
          if (category === 'graph') {
            const forceSettings = state.forceSettings as Record<string, SettingItem>
            newForceSettings = {
              ...forceSettings,
              [key]: {
                ...(forceSettings[key] || {}),
                value: value
              }
            } as GraphForceSettings
          }
          return {
            settings: newSettings,
            forceSettings: newForceSettings,
            currentPreset: null // Clear preset when manually changing settings
          }
        }),

      resetSettings: () =>
        set({
          settings: DEFAULT_SETTINGS,
          forceSettings: DEFAULT_SETTINGS.graph,
          currentPreset: 'Balanced Layout'
        }),

      getSettings: () => {
        const flatSettings: Record<string, number | boolean> = {}
        Object.entries(get().settings).forEach(([category, categorySettings]) => {
          Object.entries(categorySettings as Record<string, SettingItem>).forEach(
            ([key, setting]) => {
              flatSettings[`${category}.${key}`] = setting.value
            }
          )
        })
        return flatSettings
      },

      getCategorySettings: (category: string) => {
        const categorySettings: Record<string, number | boolean> = {}
        // @ts-expect-error indexing the settings schema with a runtime string key
        const settings = get().settings[category]
        if (settings) {
          Object.entries(settings as Record<string, SettingItem>).forEach(([key, setting]) => {
            categorySettings[key] = setting.value
          })
        }
        return categorySettings
      },

      // Force Presets
      getPresets: () => FORCE_PRESETS,

      applyPreset: (presetName: string) => {
        const preset = FORCE_PRESETS[presetName as keyof typeof FORCE_PRESETS]
        if (!preset) return

        set((state) => {
          // Create completely new objects with new references
          const newGraphSettings = { ...state.settings.graph } as Record<string, SettingItem>
          const newForceSettings = { ...state.forceSettings } as Record<string, SettingItem>

          // Update each preset value, creating new objects for each setting
          Object.entries(preset).forEach(([key, value]) => {
            if (newGraphSettings[key]) {
              newGraphSettings[key] = {
                ...newGraphSettings[key],
                value: value
              }
            }
            if (newForceSettings[key]) {
              newForceSettings[key] = {
                ...newForceSettings[key],
                value: value
              }
            }
          })

          // Create new settings object with new graph reference. Cast back to
          // the specific literal shape: newGraphSettings/newForceSettings were
          // widened to Record<string, SettingItem> above to allow mutating by
          // a dynamic preset key, but every key from DEFAULT_SETTINGS.graph is
          // still present — same keys, generically typed during the update.
          const newSettings = {
            ...state.settings,
            graph: newGraphSettings as unknown as typeof state.settings.graph
          }

          return {
            settings: newSettings,
            forceSettings: newForceSettings as unknown as GraphForceSettings,
            currentPreset: presetName
          }
        })
      },

      // UI State methods
      setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),
      setKeyboardShortcutsOpen: (open) => set({ keyboardShortcutsOpen: open }),
      setImportModalOpen: (open) => set({ importModalOpen: open }),
      toggleSettingsModal: () => set({ settingsModalOpen: !get().settingsModalOpen }),
      toggleKeyboardShortcutsModal: () =>
        set({ keyboardShortcutsOpen: !get().keyboardShortcutsOpen }),

      // Helper methods
      getSettingValue: (category: string, key: string) => {
        const categorySettings = get().settings[
          category as keyof typeof DEFAULT_SETTINGS
        ] as Record<string, SettingItem>
        return categorySettings?.[key]?.value
      },
      getSettingType: (category: string, key: string) => {
        const categorySettings = get().settings[
          category as keyof typeof DEFAULT_SETTINGS
        ] as Record<string, SettingItem>
        return categorySettings?.[key]?.type
      },
      getSettingName: (category: string, key: string) => {
        const categorySettings = get().settings[
          category as keyof typeof DEFAULT_SETTINGS
        ] as Record<string, SettingItem>
        return categorySettings?.[key]?.name
      },
      getSettingOptions: (category: string, key: string) => {
        const categorySettings = get().settings[
          category as keyof typeof DEFAULT_SETTINGS
        ] as Record<string, SettingItem>
        return categorySettings?.[key]?.options
      },
      getSettingDescription: (category: string, key: string) => {
        const categorySettings = get().settings[
          category as keyof typeof DEFAULT_SETTINGS
        ] as Record<string, SettingItem>
        return categorySettings?.[key]?.description
      },
      getSettingConstraints: (category: string, key: string) => {
        const categorySettings = get().settings[
          category as keyof typeof DEFAULT_SETTINGS
        ] as Record<string, SettingItem>
        const setting = categorySettings?.[key]
        if (setting && 'min' in setting) {
          return {
            min: setting.min,
            max: setting.max,
            step: setting.step
          }
        }
        return undefined
      }
    }),
    {
      name: 'graph-settings-storage',
      version: STORAGE_VERSION,
      partialize: (state) => ({
        settings: state.settings,
        forceSettings: state.forceSettings,
        currentPreset: state.currentPreset
      }),
      // persistedState is genuinely unknown here — it's whatever a previous
      // app version wrote to localStorage, which could be any older schema.
      // zustand's own persist types declare this as `unknown` too.
      migrate: (persistedState: unknown, version: number) => {
        // If the stored version is older than current, merge with new defaults
        if (version < STORAGE_VERSION) {
          console.log(`[Migration] Upgrading storage from v${version} to v${STORAGE_VERSION}`)

          // Deep merge function to preserve user values while adding new
          // defaults. Deliberately `any`-typed: it recurses over
          // arbitrarily-shaped old persisted data merged against the current
          // defaults, which have a different shape every time DEFAULT_SETTINGS
          // changes — there's no fixed schema to type this against.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const deepMerge = (target: any, source: any): any => {
            const result = { ...target }

            for (const key in source) {
              if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(target[key] || {}, source[key])
              } else if (!(key in target)) {
                // Only add if the key doesn't exist in target (preserves user settings)
                result[key] = source[key]
              }
            }

            return result
          }

          const oldState = persistedState as {
            settings?: Record<string, unknown>
            forceSettings?: Record<string, unknown>
          }
          return {
            ...oldState,
            settings: deepMerge(oldState.settings || {}, DEFAULT_SETTINGS),
            forceSettings: deepMerge(oldState.forceSettings || {}, DEFAULT_SETTINGS.graph)
          }
        }

        return persistedState
      }
    }
  )
)
