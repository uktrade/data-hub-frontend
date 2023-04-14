import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'

export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

export const state2props = (state) => {
  const currentAdviserId = state.currentAdviserId
  const currentAdviserName = state.currentAdviserName
  const company = state[COMPANY_DETAILS_ID].company
  const exportItem = state[EXPORT_DETAILS_ID].exportItem

  if (exportItem) {
    return { exportItem }
  }

  if (company) {
    return {
      exportItem: {
        company,
        owner: { id: currentAdviserId, name: currentAdviserName },
        team_members: [],
        estimated_export_value_years: {},
        estimated_win_date: {},
        exporter_experience: {},
      },
    }
  }

  return { exportItem: null }
}
