import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'
import { transformAPIValuesForForm } from '../transformers'

export const ID = 'exportForm'
export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

export const addContactToItem = (item, searchParams) => {
  const contactLabel = searchParams.get('new-contact-name')
  const contactValue = searchParams.get('new-contact-id')
  const newContact =
    contactLabel && contactValue
      ? { value: contactValue, label: contactLabel }
      : null

  if (newContact) {
    const formValues = transformAPIValuesForForm(item)
    return {
      ...formValues,
      contacts: [...formValues.contacts, newContact],
      scrollToContact: true,
    }
  }

  return { ...transformAPIValuesForForm(item) }
}

export const state2props = (state, { location }) => {
  const company = state[COMPANY_DETAILS_ID].company
  const exportItem = state[EXPORT_DETAILS_ID].exportItem
  const searchParams = new URLSearchParams(location.search)

  if (exportItem) {
    return {
      exportItem: addContactToItem(exportItem, searchParams),
    }
  }

  if (company) {
    return {
      exportItem: addContactToItem(
        {
          company,
          owner: {
            id: state.currentAdviserId,
            name: state.currentAdviserName,
          },
        },
        searchParams
      ),
    }
  }

  return { exportItem: null }
}
