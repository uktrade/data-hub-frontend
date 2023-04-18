import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'
import { transformAPIValuesForForm } from '../transformers'

export const ID = 'exportForm'
export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

export const overwriteObjectWithSessionStorageValues = (
  exportItem,
  searchParams
) => {
  const valuesFromStorage = JSON.parse(window.sessionStorage.getItem(ID))
  if (valuesFromStorage && searchParams.has('new-contact-name')) {
    return {
      ...transformAPIValuesForForm(exportItem),
      ...valuesFromStorage,
    }
  }
  return { ...transformAPIValuesForForm(exportItem) }
}

export const state2props = (state, { location }) => {
  const company = state[COMPANY_DETAILS_ID].company
  const exportItem = state[EXPORT_DETAILS_ID].exportItem
  const searchParams = new URLSearchParams(location.search)

  if (exportItem) {
    return {
      exportItem: overwriteObjectWithSessionStorageValues(
        exportItem,
        searchParams
      ),
    }
  }

  if (company) {
    return {
      exportItem: overwriteObjectWithSessionStorageValues(
        {
          company,
          owner: { id: state.currentAdviserId, name: state.currentAdviserName },
        },
        searchParams
      ),
    }
  }

  return { exportItem: null }
}
