import { apiProxyAxios } from '../../../components/Task/utils'

export const resendExportWin = (id) =>
  apiProxyAxios.post(`/v4/export-win/${id}/resend-win`)
