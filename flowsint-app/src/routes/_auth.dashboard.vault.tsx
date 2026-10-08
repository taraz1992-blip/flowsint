import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { keyService } from '../api/key-service'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import { Loader2, Plus, Trash2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '../components/use-confirm-dialog'
import Loader from '@/components/loader'
import { type Key as KeyType } from '@/types/key'
import { queryKeys } from '@/api/query-keys'
import ErrorState from '@/components/shared/error-state'
import { PageLayout } from '@/components/layout/page-layout'
export const Route = createFileRoute('/_auth/dashboard/vault')({
  component: VaultPage
})

function VaultPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()

  // Fetch keys
  const {
    data: keys = [],
    isLoading: keysLoading,
    error: keysError,
    refetch
  } = useQuery<KeyType[]>({
    queryKey: queryKeys.keys.list,
    queryFn: () => keyService.get()
  })

  // Create key mutation
  const createKeyMutation = useMutation({
    mutationFn: keyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.keys.list })
      setIsAddDialogOpen(false)
      setKeyName('')
      setApiKey('')
      toast.success('API-ключ успешно добавлен!')
    },
    onError: (error) => {
      toast.error('Не удалось добавить API-ключ. Попробуйте ещё раз.')
      console.error('Error creating key:', error)
    }
  })

  // Delete key mutation
  const deleteKeyMutation = useMutation({
    mutationFn: keyService.deleteById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.keys.list })
      toast.success('API-ключ успешно удалён!')
    },
    onError: (error) => {
      toast.error('Не удалось удалить API-ключ. Попробуйте ещё раз.')
      console.error('Error deleting key:', error)
    }
  })

  const handleAddKey = () => {
    if (!keyName.trim() || !apiKey.trim()) {
      toast.error('Введите и название, и API-ключ')
      return
    }
    createKeyMutation.mutate({ name: keyName.trim(), key: apiKey })
  }

  const handleDeleteKey = async (keyId: string, keyName: string) => {
    const confirmed = await confirm({
      title: 'Удалить API-ключ',
      message: `Вы уверены, что хотите удалить API-ключ «${keyName}»? Это действие нельзя отменить.`
    })

    if (confirmed) {
      deleteKeyMutation.mutate(keyId)
    }
  }

  return (
    <PageLayout
      title="Хранилище"
      description="Безопасное управление API-ключами сторонних сервисов."
      isLoading={keysLoading}
      loadingComponent={<Loader />}
      error={keysError}
      errorComponent={
        <ErrorState
          title="Не удалось загрузить ключи"
          description="Что-то пошло не так при загрузке данных. Попробуйте ещё раз."
          error={keysError}
          onRetry={() => refetch()}
        />
      }
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Добавить API-ключ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Добавить API-ключ</DialogTitle>
              <DialogDescription>
                Добавьте новый API-ключ с произвольным именем. Ключи шифруются и хранятся надёжно.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="keyName">Название ключа</Label>
                <Input
                  id="keyName"
                  placeholder="напр., OpenAI, GitHub, Shodan..."
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API-ключ</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Введите ваш API-ключ"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={createKeyMutation.isPending}
              >
                Отмена
              </Button>
              <Button
                onClick={handleAddKey}
                disabled={createKeyMutation.isPending || !keyName.trim() || !apiKey.trim()}
              >
                {createKeyMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Добавить ключ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="w-full">
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <KeyRound className="w-12 h-12 text-muted-foreground/40" strokeWidth={1.5} />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">Ключей пока нет</h3>
              <p className="text-muted-foreground max-w-xs leading-relaxed">
                Добавьте первый API-ключ, чтобы использовать сторонние сервисы в расследованиях.
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавьте первый ключ
            </Button>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">API-ключи</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {keys.length} {keys.length === 1 ? 'key' : 'ключей'}
                </span>
              </div>
              <CardDescription>
                Ваши зашифрованные API-ключи для внешних сервисов. Эти ключи будут доступны для ваших
                investigations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/20">
                    <TableHead className="py-3 px-6 w-2/5">Название</TableHead>
                    <TableHead className="py-3 w-1/3">Добавлено</TableHead>
                    <TableHead className="py-3 px-6 text-right w-1/5">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key: KeyType) => (
                    <TableRow key={key.id} className="hover:bg-muted/30 border-b border-border/50">
                      <TableCell className="py-4 px-6 font-medium">{key.name}</TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        {new Date(key.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteKey(key.id, key.name)}
                          disabled={deleteKeyMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}

export default VaultPage
