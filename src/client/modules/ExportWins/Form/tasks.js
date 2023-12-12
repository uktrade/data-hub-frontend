import { apiProxyAxios } from '../../../components/Task/utils'
import { idNameToValueLabel } from '../../../../client/utils'

const isEstimatedWinDateValid = (estimatedWinDate) => {
  // Business date logic
  const today = new Date()
  const from = new Date(today.getFullYear() - 1, today.getMonth(), 1)
  return estimatedWinDate >= from && estimatedWinDate <= today
}

const transformExportProjectToForm = (exportProject) => {
  const date = new Date(exportProject.estimated_win_date) // "YYYY-MM-DD"
  return {
    // Officer details
    adviser: idNameToValueLabel(exportProject.owner),
    team_members: exportProject.team_members.map(idNameToValueLabel),
    // Customer details
    exporter_experience: idNameToValueLabel(exportProject.exporter_experience)
      .value,
    contact:
      exportProject.contacts.length > 0
        ? idNameToValueLabel(exportProject.contacts[0])
        : null,
    // Win Details
    win_date: isEstimatedWinDateValid(date) && {
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1),
    },
    sector: idNameToValueLabel(exportProject.sector),
    destination_country: idNameToValueLabel(exportProject.destination_country),
  }
}

export const getExportProject = ({ id }) =>
  apiProxyAxios
    .get(`/v4/export/${id}`)
    .then(({ data }) => transformExportProjectToForm(data))

// For now just resolve the promise until we have an endpoint
export const saveExportWin = () => Promise.resolve('saved')
