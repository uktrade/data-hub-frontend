import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'
import { transformAPIValuesForForm } from '../transformers'

export const ID = 'exportForm'
export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

const overwriteObjectWithSessionStorageValues = (exportItem) => {
  const valuesFromStorage = JSON.parse(window.sessionStorage.getItem(ID))
  if (valuesFromStorage) {
    return {
      ...transformAPIValuesForForm(exportItem),
      ...valuesFromStorage,
    }
  }
  return { ...transformAPIValuesForForm(exportItem) }
}

export const state2props = (state) => {
  const company = state[COMPANY_DETAILS_ID].company
  const exportItem = state[EXPORT_DETAILS_ID].exportItem

  if (exportItem) {
    return {
      exportItem: overwriteObjectWithSessionStorageValues(exportItem),
    }
  }

  if (company) {
    return {
      exportItem: overwriteObjectWithSessionStorageValues({
        company,
        owner: { id: state.currentAdviserId, name: state.currentAdviserName },
      }),
    }
  }

  return { exportItem: null }
}
