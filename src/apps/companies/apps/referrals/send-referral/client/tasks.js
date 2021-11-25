import { ID as STORE_ID } from './state'
import getContactFromQuery from '../../../../../../client/utils/getContactFromQuery'
import { apiProxyAxios } from '../../../../../../client/components/Task/utils'

export async function getInitialFormValues({ adviser, subject, notes, contact }) {
  const valuesFromStorage = JSON.parse(
    window.sessionStorage.getItem(STORE_ID)
  )

  const queryContact = getContactFromQuery()

  if (queryContact.label && queryContact.value) {
    valuesFromStorage.contact = {
      label: queryContact.label,
      value: queryContact.value,
    }
  }

  return valuesFromStorage
}

export function openContactForm({ values, url }) {
  window.sessionStorage.setItem(
    STORE_ID,
    JSON.stringify({
      ...values,
    })
  )
  window.location.href = url
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
