import { toast } from 'sonner'
import { useConfirm } from '@/components/use-confirm-dialog'
import { flowService } from '@/api/flow-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/query-keys'
import { useLayoutStore } from '@/stores/layout-store'
import { t } from '@/i18n'

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
    if (!sketch_id) return toast.error(t('Could not find the graph.'))
    if (askUser) {
      const confirmed = await confirm({
        title: t('{{flow_id}} scan', { flow_id }),
        message: t("You're about to launch {{flow_id}} flow on {{node_idsCount}} items.", {
          flow_id,
          node_idsCount: node_ids.length
        })
      })
      if (!confirmed) return
    }
    const body = JSON.stringify({ node_ids, sketch_id })
    const count = node_ids.length

    toast.promise(launchFlowMutation.mutateAsync({ flowId: flow_id, body }), {
      loading: t('Loading...'),
      success: () => t('Flow {{flow_id}} has been launched on {{count}} node.', { flow_id, count }),
      error: () => t('An error occurred launching flow.')
    })
    return
  }

  return {
    launchFlow
  }
}
