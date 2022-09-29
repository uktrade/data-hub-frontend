import { formatMediumDateTime } from '../../../utils/date'

const contactAuditLabels = {
  title: 'Title',
  jobTitle: 'Job title',
  fullTelephoneNumber: 'Phone number',
  telephoneCountryCode: 'Telephone country code',
  email: 'Email',
  emailMarketing: 'Email marketing',
  address: 'Address',
  notes: 'More details',
  addressSameAsCompany: 'Address same as company',
  firstName: 'First name',
  lastName: 'Last name',
  archived: 'Archived status',
  archivedBy: 'Archived by',
  address1: 'Address line 1',
  address2: 'Address line 2',
  address3: 'Address line 3',
  address4: 'Address line 4',
  addressTown: 'Town',
  addressCounty: 'County',
  addressCountry: 'Country',
  addressPostcode: 'Postcode',
  archivedOn: 'Archive date',
  archivedReason: 'Archived reason',
  archivedById: 'Archived by',
}

const transformChanges = (changes, labels) =>
  Object.keys(changes)
    .map((key) => labels[key] || key)
    .join(', ')

const getBadgeText = (length) =>
  length == 1 ? '1 change' : length + ' changes'

export const transformContactAuditHistoryToListItem = (auditHistory) => {
  const changesSaved = !!Object.keys(auditHistory.changes).length
  const metadata = [{ label: 'Adviser', value: auditHistory.user.name }]

  if (changesSaved) {
    metadata.push({
      label: 'Fields',
      value: transformChanges(auditHistory.changes, contactAuditLabels),
    })
  }

  const badges = [
    {
      text: changesSaved
        ? getBadgeText(Object.keys(auditHistory.changes).length)
        : 'No changes saved',
    },
  ]

  return {
    id: auditHistory.id,
    metadata: metadata,
    badges: badges.filter((item) => item.text),
    headingText: `${formatMediumDateTime(auditHistory.timestamp)}`,
  }
}

export const transformResponseToCollection = ({ results = [] }) =>
  results.map((result) => transformContactAuditHistoryToListItem(result))
