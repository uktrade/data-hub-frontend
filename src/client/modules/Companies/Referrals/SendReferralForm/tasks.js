import { ID as STORE_ID } from './state'
import getContactFromQuery from '../../../../utils/getContactFromQuery'
import { apiProxyAxios } from '../../../../components/Task/utils'

export async function getInitialFormValues() {
  const valuesFromStorage = JSON.parse(window.sessionStorage.getItem(STORE_ID))

  const queryContact = getContactFromQuery()

  if (queryContact.label && queryContact.value) {
    valuesFromStorage.contact = {
      label: queryContact.label,
      value: queryContact.value,
    }
  }

  return valuesFromStorage
}

export async function saveReferral({ values, companyId }) {
  window.sessionStorage.removeItem(STORE_ID)

  const { adviser, subject, notes, contact } = values
  await apiProxyAxios.post('v4/company-referral', {
    company: companyId,
    recipient: adviser.value,
    subject,
    notes,
    contact: contact?.value,
  })
}
