import { Step } from 'react-joyride'

export const tutorialSteps: Record<string, Step[]> = {
  '/dashboard': [
    {
      target: '[data-tour-id="welcome"]',
      content: 'Добро пожаловать во Flowsint! Это руководство познакомит вас с основными возможностями.',
      disableBeacon: true
    },
    {
      target: '[data-tour-id="navigation"]',
      content: 'Используйте эту панель навигации для перехода по разделам.'
    }
  ],

  '/dashboard/flows/$flowId': [
    {
      target: '[data-tour-id="flow-sidebar"]',
      content: 'Добро пожаловать в редактор потоков! Перетаскивайте обогатители в поток из боковой панели.',
      disableBeacon: true
    },
    {
      target: '[data-tour-id="flow-canvas"]',
      content:
        'Холст — ваше рабочее пространство. Перетаскивайте сюда обогатители и соединяйте их, чтобы построить конвейер данных.'
    },
    {
      target: '[data-tour-id="add-type-node"]',
      content: 'Начните с добавления узла типа, чтобы задать тип входных данных потока.'
    },
    {
      target: '[data-tour-id="add-enricher-node"]',
      content:
        'Затем добавьте обогатители для обработки данных. Соединяйте их, нажимая на точки соединения.'
    },
    {
      target: '[data-tour-id="node-params"]',
      content: 'Дважды щёлкните по узлу или нажмите правую кнопку, чтобы настроить его параметры.'
    },
    {
      target: '[data-tour-id="layout-button"]',
      content: 'Используйте кнопку автораскладки, чтобы аккуратно упорядочить узлы.'
    },
    {
      target: '[data-tour-id="save-button"]',
      content: 'Сохраните поток, чтобы использовать его повторно и делиться им.'
    },
    {
      target: '[data-tour-id="compute-button"]',
      content:
        'Нажмите «Рассчитать», чтобы смоделировать выполнение потока и увидеть путь данных.'
    },
    {
      target: '[data-tour-id="simulation-controls"]',
      content:
        'Управляйте симуляцией кнопками «Пауза», «Пропустить» и «Сброс». При необходимости измените скорость.'
    }
  ],

  '/dashboard/flows': [
    {
      target: '[data-tour-id="create-flow"]',
      content: 'Нажмите здесь, чтобы создать новый поток обогащения данных.',
      disableBeacon: true
    },
    {
      target: '[data-tour-id="flow-list"]',
      content: 'Здесь перечислены все ваши потоки. Нажмите на поток, чтобы изменить или запустить его.'
    }
  ],

  '/dashboard/investigations': [
    {
      target: '[data-tour-id="create-investigation"]',
      content: 'Начните новое расследование здесь.',
      disableBeacon: true
    },
    {
      target: '[data-tour-id="investigation-list"]',
      content: 'Управляйте текущими расследованиями и открывайте их графы связей.'
    }
  ]
}

export function hasStepsForRoute(route: string): boolean {
  return route in tutorialSteps
}

export function getStepsForRoute(route: string): Step[] {
  return tutorialSteps[route] || []
}
