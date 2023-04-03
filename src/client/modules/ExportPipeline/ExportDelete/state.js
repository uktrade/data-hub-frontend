import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'

export const TASK_DELETE_EXPORT = 'TASK_DELETE_EXPORT'

export const state2props = (state) => ({
  exportItem: state[EXPORT_DETAILS_ID].exportItem,
})
