import { apiProxyAxios } from '../../../components/Task/utils'

import {
  transformExportWinForForm,
  transformExportProjectForForm,
} from './transformers'

import getContactFromQuery from '../../../../client/utils/getContactFromQuery'

import { ID as STORE_ID } from './state'

const exportWinEndpoint = '/v4/export-win'

export const getExportProject = ({ id }) =>
  apiProxyAxios
    .get(`/v4/export/${id}`)
    .then(({ data }) => transformExportProjectForForm(data))

export const getExportWin = ({ id }) =>
  apiProxyAxios
    .get(`${exportWinEndpoint}/${id}`)
    .then(({ data }) => transformExportWinForForm(data))

export const saveExportWin = ({ exportWinId, payload }) => {
  const request = exportWinId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = exportWinId
    ? `${exportWinEndpoint}/${exportWinId}`
    : exportWinEndpoint

  return request(endpoint, payload)
}

export const getInitialFormValues = async ({ id, exportId }) => {
  const formValues = id != null ? await getExportWin({ id }) : {}
  const exportProject =
    exportId != null ? await getExportProject({ id: exportId }) : {}

  const valuesFromStorage =
    JSON.parse(window.sessionStorage.getItem(STORE_ID)) || {}
  window.sessionStorage.removeItem(STORE_ID)

  const queryContact = getContactFromQuery()
  if (queryContact.label && queryContact.value) {
    valuesFromStorage.company_contacts = {
      label: queryContact.label,
      value: queryContact.value,
    }
  }
  return {
    ...formValues,
    ...exportProject,
    ...valuesFromStorage,
  }
}

export const resendExportWin = (id) =>
  apiProxyAxios.post(`/v4/export-win/${id}/resend-win`)
