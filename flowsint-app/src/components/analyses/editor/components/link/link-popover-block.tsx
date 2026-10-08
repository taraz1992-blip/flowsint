import * as React from 'react'
import { Separator } from '@/components/ui/separator'
import { ToolbarButton } from '../toolbar-button'
import { Copy, ExternalLink, Unlink } from 'lucide-react'

interface LinkPopoverBlockProps {
  url: string
  onClear: () => void
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({ url, onClear, onEdit }) => {
  const [copyTitle, setCopyTitle] = React.useState<string>('Copy')

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle('Copied!')
          setTimeout(() => setCopyTitle('Copy'), 1000)
        })
        .catch(console.error)
    },
    [url]
  )

  const handleOpenLink = React.useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [url])

  return (
    <div className="flex h-10 overflow-hidden rounded-mdbg-background p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton tooltip="Изменить ссылку" onClick={onEdit} className="w-auto px-2">
          Изменить ссылку
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton tooltip="Открыть ссылку в новой вкладке" onClick={handleOpenLink}>
          <ExternalLink className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton tooltip="Убрать ссылку" onClick={onClear}>
          <Unlink className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip={copyTitle}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (e) => {
              if (e.target === e.currentTarget) e.preventDefault()
            }
          }}
        >
          <Copy className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}
