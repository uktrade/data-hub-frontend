import { apiProxyAxios } from '../../../components/Task/utils'

import {
  transformExportWinForForm,
  transformExportProjectForForm,
} from './transformers'

export const getExportProject = ({ id }) =>
  apiProxyAxios
    .get(`/v4/export/${id}`)
    .then(({ data }) => transformExportProjectForForm(data))

export const getExportWin = ({ id }) =>
  apiProxyAxios
    .get(`/v4/export_win/${id}`)
    .then(({ data }) => transformExportWinForForm(data))

export const saveExportWin = ({ exportWinId, payload }) => {
  const request = exportWinId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = exportWinId
    ? `/v4/export_win/${exportWinId}`
    : '/v4/export_win'

  return request(endpoint, payload)
}
