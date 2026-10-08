import { analysisService } from '@/api/analysis-service'
import { Analysis } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import default_content from '@/components/analyses/default_content.json'
import { queryKeys } from '@/api/query-keys'
import { toast } from 'sonner'

export const useCreateAnalysis = (
  investigationId: string,
  onAnalysisCreate?: (investigationId: string) => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const newAnalysis: Partial<Analysis> = {
        title: 'Анализ без названия',
        investigation_id: investigationId,
        content: default_content
      }
      const res = await analysisService.create(JSON.stringify(newAnalysis))
      return res
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.analyses.byInvestigation(investigationId || '')
      })
      onAnalysisCreate?.(investigationId)
      toast.success('Новый анализ создан')
    },
    onError: (error) => {
      toast.error(
        'Не удалось создать анализ: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка')
      )
    }
  })
}
