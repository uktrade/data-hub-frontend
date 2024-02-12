import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'
import { transformAPIValuesForForm } from '../transformers'
import { getQueryParamsFromLocation } from '../../../utils/url'

export const ID = 'exportForm'
export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

const getContactFromLocation = (location) => {
  const queryParams = getQueryParamsFromLocation(location)
  const label = queryParams['new-contact-name']
  const value = queryParams['new-contact-id']
  return label && value ? { value, label } : null
}

export const state2props = (state, { location }) => {
  const { exportItem } = state[EXPORT_DETAILS_ID]
  const { company } = state[COMPANY_DETAILS_ID]

  if (!exportItem && !company) {
    return { exportItem: null }
  }

  const formValues = exportItem
    ? transformAPIValuesForForm(exportItem)
    : transformAPIValuesForForm({
        company,
        owner: {
          id: state.currentAdviserId,
          name: state.currentAdviserName,
        },
      })

  const contact = getContactFromLocation(location)

  return {
    exportItem: {
      ...formValues,
      ...(contact && {
        contacts: [...formValues.contacts, contact],
        scrollToContact: true,
      }),
    },
  }
}
