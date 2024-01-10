import { apiProxyAxios } from '../../../components/Task/utils'
import { idNameToValueLabel } from '../../../../client/utils'
import { getTwelveMonthsAgo } from './utils'

const isEstimatedWinDateValid = (estimatedWinDate) => {
  // Business date logic
  const today = new Date()
  const from = getTwelveMonthsAgo()
  return estimatedWinDate >= from && estimatedWinDate <= today
}

const transformExportProjectToForm = (exportProject) => {
  const date = new Date(exportProject.estimated_win_date) // "YYYY-MM-DD"
  return {
    // Officer details
    lead_officer: idNameToValueLabel(exportProject.owner),
    team_members: exportProject.team_members.map(idNameToValueLabel),
    // Customer details
    export_experience:
      // We need the check here as exporter_experience is
      // optional within the Export project form
      exportProject.exporter_experience &&
      idNameToValueLabel(exportProject.exporter_experience).value,
    contact:
      exportProject.contacts.length === 1
        ? idNameToValueLabel(exportProject.contacts[0])
        : null, // Get the user to choose the contact
    // Win Details
    win_date: isEstimatedWinDateValid(date) && {
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1),
    },
    sector: idNameToValueLabel(exportProject.sector),
    country: idNameToValueLabel(exportProject.destination_country),
  }
}

export const getExportProject = ({ id }) =>
  apiProxyAxios
    .get(`/v4/export/${id}`)
    .then(({ data }) => transformExportProjectToForm(data))

export const saveExportWin = ({ exportWinId, payload }) => {
  const request = exportWinId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = exportWinId
    ? `/v4/export_win/${exportWinId}`
    : '/v4/export_win'

  return request(endpoint, payload)
}
