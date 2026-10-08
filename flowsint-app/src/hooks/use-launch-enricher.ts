import { toast } from 'sonner'
import { useConfirm } from '@/components/use-confirm-dialog'
import { enricherService } from '@/api/enricher-service'
import { useLayoutStore } from '@/stores/layout-store'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/query-keys'

export function useLaunchEnricher(askUser: boolean = false) {
  const { confirm } = useConfirm()
  const openClonsole = useLayoutStore((s) => s.openConsole)
  const queryClient = useQueryClient()

  const launchEnricher = async (
    node_ids: string[],
    enricherName: string,
    sketch_id: string | null | undefined,
    params?: Record<string, string>
  ) => {
    if (!sketch_id) return toast.error('Не удалось найти граф.')
    if (askUser) {
      const confirmed = await confirm({
        title: `Сканирование: ${enricherName}`,
        message: `Вы собираетесь запустить обогатитель ${enricherName} для элементов: ${node_ids.length}.`
      })
      if (!confirmed) return
    }
    // Omitted rather than sent as null when the enricher declares no params,
    // so callers that never had params keep sending the exact same payload.
    const body = JSON.stringify(params ? { node_ids, sketch_id, params } : { node_ids, sketch_id })
    const count = node_ids.length
    toast.promise(enricherService.launch(enricherName, body), {
      loading: 'Загрузка...',
      success: () =>
        `Enricher ${enricherName} has been launched on ${count} node${count > 1 ? 's' : ''}.`,
      error: () => `An error occurred launching enricher.`
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.scans.list
    })
    openClonsole()
    return
  }
  return {
    launchEnricher
  }
}
