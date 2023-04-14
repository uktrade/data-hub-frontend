import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as Export_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'

export const ID = 'exportForm'
export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

export const state2props = (state) => {
  const valuesFromStorage = JSON.parse(window.sessionStorage.getItem(ID))
  if (valuesFromStorage) {
    valuesFromStorage.company = { id: valuesFromStorage.company }
  }
  return {
    company: state[COMPANY_DETAILS_ID].company,
    exportItem: valuesFromStorage
      ? valuesFromStorage
      : state[Export_DETAILS_ID].exportItem,
    fromSession: !!valuesFromStorage,
    currentAdviserId: state.currentAdviserId,
    currentAdviserName: state.currentAdviserName,
  }
}

// export const state2props = (state) => ({
//   company: state[COMPANY_DETAILS_ID].company,
//   exportItem: state[Export_DETAILS_ID].exportItem,
//   currentAdviserId: state.currentAdviserId,
//   currentAdviserName: state.currentAdviserName,
// })
