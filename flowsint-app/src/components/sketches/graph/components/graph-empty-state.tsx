import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'

interface GraphEmptyStateProps {
  onOpenAddDialog: () => void
  onOpenImportDialog: () => void
  className?: string
  style?: React.CSSProperties
}

export const GraphEmptyState: React.FC<GraphEmptyStateProps> = ({
  onOpenAddDialog,
  onOpenImportDialog,
  className = '',
  style
}) => {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`} style={style}>
      <div className="text-center text-muted-foreground max-w-md mx-auto p-6">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Нет данных для визуализации</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Начните расследование с добавления узлов, чтобы увидеть их на графе.
        </p>
        <div className="space-y-2 text-xs text-muted-foreground mb-6">
          <p>
            <strong>Совет:</strong>  Найдите сущности через поиск или импортируйте данные, чтобы начать
          </p>
          <p>
            <strong>Изучить:</strong>  Попробуйте искать домены, адреса почты или другие сущности
          </p>
          <p>
            <strong>Метки:</strong>  Приблизьте (больше 2x), чтобы увидеть все подписи, иконки и рёбра
          </p>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <Button onClick={onOpenAddDialog}>
            <Plus />
            Добавьте первый элемент
          </Button>
          <span className="opacity-60">или</span>
          <Button variant="secondary" onClick={onOpenImportDialog}>
            <Upload />  Импорт данных
          </Button>
        </div>
      </div>
    </div>
  )
}
