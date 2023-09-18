import { apiProxyAxios } from '../../../../components/Task/utils'

export const deleteProjectDocument = (values) => {
  const options = {
    url: `v3/investment/${values.projectId}/evidence-document/${values.documentId}`,
    method: 'DELETE',
  }
  return apiProxyAxios(options)
}
