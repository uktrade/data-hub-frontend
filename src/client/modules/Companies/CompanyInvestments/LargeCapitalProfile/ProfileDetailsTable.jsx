import React from 'react'

import { SummaryTable } from '../../../../components'
import { requiredCheckTypes } from './constants'
import { formatDate, DATE_FORMAT_COMPACT } from '../../../../utils/date-utils'

const buildRequiredCheckField = (
  requiredChecks,
  requiredChecksConductedBy,
  requiredChecksConductedOn
) => {
  if (
    requiredChecks.name == requiredCheckTypes.CLEARED ||
    requiredChecks.name == requiredCheckTypes.ISSUES_IDENTIFIED
  ) {
    return (
      requiredChecks.name +
      `\n` +
      `Date of most recent background checks: ${formatDate(
        requiredChecksConductedOn,
        DATE_FORMAT_COMPACT
      )}` +
      `\n` +
      `Person responsible for most recent background checks: ${requiredChecksConductedBy?.name}`
    )
  }
  return requiredChecks ? requiredChecks.name : ''
}

const ProfileDetailsTable = ({ profile }) => {
  const {
    globalAssetsUnderManagement,
    investableCapital,
    investorDescription,
    investorType,
    requiredChecksConducted,
    requiredChecksConductedBy,
    requiredChecksConductedOn,
  } = profile

  return (
    <>
      <SummaryTable.TextRow
        heading="Investor type"
        value={investorType?.name}
      />
      <SummaryTable.TextRow
        heading="Global assets under management"
        value={globalAssetsUnderManagement ? globalAssetsUnderManagement : ''}
      />
      <SummaryTable.TextRow
        heading="Investable capital"
        value={investableCapital ? investableCapital : ''}
      />
      <SummaryTable.TextRow
        heading="Investor description"
        value={investorDescription}
      />
      <SummaryTable.TextRow
        heading="Has this investor cleared the required checks within the last 12 months?"
        value={
          requiredChecksConducted
            ? buildRequiredCheckField(
                requiredChecksConducted,
                requiredChecksConductedBy,
                requiredChecksConductedOn
              )
            : ''
        }
      />
    </>
  )
}

export default ProfileDetailsTable
