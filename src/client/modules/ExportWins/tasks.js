import { apiProxyAxios } from '../../components/Task/utils'

export const patchExportWinReview = ({ review, token }) =>
  apiProxyAxios.patch(`/v4/export-win/review/${token}`, review)
