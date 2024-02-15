import { apiProxyAxios } from '../../../components/Task/utils'

import {
  transformExportWinForForm,
  transformExportProjectForForm,
} from './transformers'

const exportWinEndpoint = '/v4/export-win'
import { ID } from './state'

export const getExportProject = ({ id }) =>
  apiProxyAxios
    .get(`/v4/export/${id}`)
    .then(({ data }) => transformExportProjectForForm(data))

export const getExportWin = ({ id }) =>
  apiProxyAxios
    .get(`${exportWinEndpoint}/${id}`)
    .then(({ data }) => transformExportWinForForm(data))

export const saveExportWin = ({ exportWinId, payload }) => {
  window.sessionStorage.removeItem(ID)
  const request = exportWinId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = exportWinId
    ? `${exportWinEndpoint}/${exportWinId}`
    : exportWinEndpoint

  return request(endpoint, payload)
}
