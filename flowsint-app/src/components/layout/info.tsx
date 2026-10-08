import { memo } from 'react'
import { HelpCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

const InfoDialog = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
              <HelpCircle className="h-3 w-3 opacity-60" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <div className="p-2">
            <div className="p-2 text-sm space-y-4 overflow-y-auto max-h-[80vh]">
              <h2 className="text-base font-semibold flex items-center gap-2">О Flowsint</h2>
              <p>
                <strong>Flowsint</strong> — это <strong>платформа расследований и разведки</strong>,
                созданная для сложных исследовательских процессов с участием{' '}
                <strong>людей, организаций, инфраструктуры и онлайн-активности</strong>.
              </p>

              <p>
                Проводите ли вы <strong>кибер-расследования</strong>, картируете{' '}
                <strong>мошеннические сети</strong> или собираете данные для{' '}
                <strong>оценки угроз</strong> — Flowsint помогает собирать, визуализировать и
                осмысливать разрозненные данные в структурированном и интерактивном виде.
              </p>

              <h3 className="font-semibold">Что делает Flowsint</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Связывает разрозненные данные</strong> — адреса почты, домены, аккаунты в
                  соцсетях, IP, номера телефонов, адреса и многое другое — в единый{' '}
                  <strong>граф расследования</strong>.
                </li>
                <li>
                  Предлагает <strong>визуальные обогатители</strong>, чтобы переходить от одной
                  сущности к связанным: находить <strong>связанных лиц</strong>, обнаруживать{' '}
                  <strong>инфраструктуру</strong>, раскрывать <strong>псевдонимы</strong>.
                </li>
                <li>
                  <strong>Отслеживает и сохраняет состояния расследования</strong> со временем, позволяя
                  проверять разные гипотезы и возвращаться к старым линиям, не теряя контекст.
                </li>
                <li>
                  Поддерживает <strong>обогащение данных в реальном времени</strong> с помощью
                  собственных и встроенных обогатителей, давая <strong>практичные выводы</strong> по
                  мере исследования.
                </li>
              </ul>

              <h3 className="font-semibold">Зачем использовать Flowsint?</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Создан для <strong>скорости и ясности</strong> — быстрая отрисовка графа, чистый
                  интерфейс, отзывчивые обогатители.
                </li>
                <li>
                  <strong>Гибкая графовая модель</strong>, отражающая то, как мыслят следователи: не
                  просто таблицы и теги, а <strong>связи</strong>.
                </li>
                <li>
                  Подходит для <strong>аналитиков-одиночек и команд</strong>, которым нужно быстро
                  двигаться, свободно исследовать и разбираться в{' '}
                  <strong>неполных или хаотичных данных</strong>.
                </li>
              </ul>

              <h3 className="font-semibold">Сценарии использования</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Картирование <strong>цифровой инфраструктуры</strong> людей или организаций
                </li>
                <li>
                  Расследование <strong>схем онлайн-мошенничества</strong> или{' '}
                  <strong>поддельных личностей</strong>
                </li>
                <li>
                  Выявление <strong>связей между акторами</strong> на разных платформах
                </li>
                <li>
                  Оценка масштаба <strong>утёкших или открытых данных</strong>
                </li>
                <li>
                  Отслеживание <strong>поведения акторов угроз</strong> в социальных и технических
                  средах
                </li>
              </ul>

              <p>
                Flowsint создан для <strong>профессионалов</strong>, которым нужен{' '}
                <strong>полный контроль</strong> над логикой расследования: от структуры данных до
                интерпретации связей. Это не просто инструмент, а{' '}
                <strong>гибкое рабочее пространство</strong> для построения аналитики.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(InfoDialog)
