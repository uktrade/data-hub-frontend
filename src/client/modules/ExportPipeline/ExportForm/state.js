import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as Export_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'

export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

export const state2props = (state) => ({
  company: state[COMPANY_DETAILS_ID].company,
  exportItem: state[Export_DETAILS_ID].exportItem,
})
