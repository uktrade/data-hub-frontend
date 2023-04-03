import React from 'react'
import { Link } from 'govuk-react'

import { INTERACTION_STATUS } from '../../../../apps/interactions/constants'
import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'

const groupExportCountries = require('../../../../lib/group-export-countries')

const excludedServiceStrings = [
  'A Specific DBT Export Service or Funding',
  'A Specific Service',
  'Enquiry or Referral Received',
  'Enquiry Received',
]

const getName = (obj) => obj.name

const checkUrl = (stringToCheck) => window.location.href.includes(stringToCheck)

const getCompanyId = (companyObject, companyArray) =>
  companyObject ? companyObject.id : companyArray[0].id

export const transformService = (serviceName) => {
  const splitServiceName = serviceName.split(' : ')
  const transformedServiceName =
    splitServiceName[1] && excludedServiceStrings.includes(splitServiceName[0])
      ? splitServiceName[1]
      : serviceName

  return transformedServiceName
}

export const transformArray = (arr = []) => arr.map(getName).join(', ')
export const isEditable = (status) => status === INTERACTION_STATUS.COMPLETE
export const isIncomplete = (status, date, archived) =>
  status === INTERACTION_STATUS.DRAFT &&
  new Date(date) < new Date() &&
  !archived
export const isNotEditable = (status, date, archived) =>
  !isEditable(status) && !isIncomplete(status, date, archived) && !archived

export const transformCompany = (companyObject, companyArray) => {
  const company = companyObject ? companyObject : companyArray[0]

  return (
    <SummaryTable.Row
      heading="Company"
      children={
        <Link href={urls.companies.details(company.id)}>{company.name}</Link>
      }
    />
  )
}

export const transformContacts = (contacts) =>
  contacts.map((contact) => (
    <Link href={urls.contacts.details(contact.id)}>{contact.name}</Link>
  ))

export const transformAdvisers = (advisers) =>
  advisers.map((adviser) => adviser?.adviser?.name + ', ' + adviser?.team?.name)

export const transformExportCountries = (countries) => {
  const groupedCountries = groupExportCountries(countries)

  for (const status in groupedCountries) {
    groupedCountries[status] = groupedCountries[status].map(getName).join(', ')
  }

  return (
    <>
      {groupedCountries.currently_exporting.length > 0 && (
        <SummaryTable.Row
          heading="Countries currently exporting to"
          children={groupedCountries.currently_exporting}
        />
      )}
      {groupedCountries.future_interest.length > 0 && (
        <SummaryTable.Row
          heading="Future countries of interest"
          children={groupedCountries.future_interest}
        />
      )}
      {groupedCountries.not_interested.length > 0 && (
        <SummaryTable.Row
          heading="Countries not interested in"
          children={groupedCountries.not_interested}
        />
      )}
    </>
  )
}

export const transformKind = (kind) =>
  kind === 'service_delivery' ? 'service delivery' : kind

export const setReferralId = (referral, companies) => {
  const hasCompany = companies?.length
  if (referral && hasCompany) {
    return (referral.companyId = companies[0].id)
  }
  return null
}

export const getEditLink = (
  interactionId,
  companyObject,
  companyArray,
  referral
) => {
  const companyId = getCompanyId(companyObject, companyArray)
  const isCompanyPage = checkUrl('companies')
  const isReferral = checkUrl('referral')
  return isReferral
    ? urls.companies.referrals.interactions.edit(
        companyId,
        referral.id,
        interactionId
      )
    : isCompanyPage
    ? urls.companies.interactions.edit(companyId, interactionId)
    : urls.interactions.edit(interactionId)
}

export const getDetailsLink = (
  interactionId,
  companyObject,
  companyArray,
  referral
) => {
  const companyId = getCompanyId(companyObject, companyArray)
  const isCompanyPage = checkUrl('companies')
  const isReferral = checkUrl('referral')
  return isReferral
    ? urls.companies.referrals.interactions.detail(
        companyId,
        referral.id,
        interactionId
      )
    : isCompanyPage
    ? urls.companies.interactions.detail(companyId, interactionId)
    : urls.interactions.detail(interactionId)
}
