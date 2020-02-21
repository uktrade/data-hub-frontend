import { ID as STORE_ID } from './state'
import getContactFromQuery from '../../../../../../client/utils/getContactFromQuery'
import { apiProxyAxios } from '../../../../../../client/components/Task/utils'

export function openContactForm({ values, url }) {
  window.sessionStorage.setItem(
    STORE_ID,
    JSON.stringify({
      values,
    })
  )
  window.location.href = url
}

export function restoreState() {
  const stateFromStorage = window.sessionStorage.getItem(STORE_ID)

  if (!stateFromStorage) {
    return {}
  }

  const queryContact = getContactFromQuery()
  if (queryContact.label && queryContact.value) {
    const updatedState = JSON.parse(stateFromStorage)
    updatedState.values.contact = {
      label: queryContact.label,
      value: queryContact.value,
    }
    return updatedState
  }

  return JSON.parse(stateFromStorage)
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
