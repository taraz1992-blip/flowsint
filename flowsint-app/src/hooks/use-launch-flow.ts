import { toast } from 'sonner'
import { useConfirm } from '@/components/use-confirm-dialog'
import { flowService } from '@/api/flow-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/query-keys'
import { useLayoutStore } from '@/stores/layout-store'

export function useLaunchFlow(askUser: boolean = false) {
  const { confirm } = useConfirm()
  const queryClient = useQueryClient()
  const openClonsole = useLayoutStore((s) => s.openConsole)

  // Launch flow mutation
  const launchFlowMutation = useMutation({
    mutationFn: ({ flowId, body }: { flowId: string; body: BodyInit }) =>
      flowService.launch(flowId, body),
    onSuccess: (_, variables) => {
      openClonsole()
      queryClient.invalidateQueries({
        queryKey: queryKeys.flows.detail(variables.flowId)
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.scans.list
      })
    },
    onError: (error) => {
      console.error('Error launching flow:', error)
    }
  })

  const launchFlow = async (
    node_ids: string[],
    flow_id: string,
    sketch_id: string | null | undefined
  ) => {
    if (!sketch_id) return toast.error('Не удалось найти граф.')
    if (askUser) {
      const confirmed = await confirm({
        title: `Сканирование: ${flow_id}`,
        message: `Вы собираетесь запустить поток ${flow_id} для элементов: ${node_ids.length}.`
      })
      if (!confirmed) return
    }
    const body = JSON.stringify({ node_ids, sketch_id })
    const count = node_ids.length

    toast.promise(launchFlowMutation.mutateAsync({ flowId: flow_id, body }), {
      loading: 'Загрузка...',
      success: () => `Flow ${flow_id} has been launched on ${count} node${count > 1 ? 's' : ''}.`,
      error: () => `An error occurred launching flow.`
    })
    return
  }

  return {
    launchFlow
  }
}
