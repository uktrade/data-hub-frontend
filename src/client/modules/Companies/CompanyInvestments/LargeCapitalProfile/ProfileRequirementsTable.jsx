import React from 'react'

import { SummaryTable } from '../../../../components'
import { transformArray } from './transformers'

const ProfileRequirementsTable = ({ profile }) => {
  const {
    assetClassesOfInterest,
    constructionRisks,
    dealTicketSizes,
    desiredDealRoles,
    investmentTypes,
    minimumEquityPercentage,
    minimumReturnRate,
    restrictions,
    timeHorizons,
  } = profile

  return (
    <>
      <SummaryTable.TextRow
        heading="Deal ticket size"
        value={transformArray(dealTicketSizes)}
      />
      <SummaryTable.TextRow
        heading="Asset classes of interest"
        value={transformArray(assetClassesOfInterest)}
      />
      <SummaryTable.TextRow
        heading="Types of investment"
        value={transformArray(investmentTypes)}
      />
      <SummaryTable.TextRow
        heading="Minimum return rate"
        value={minimumReturnRate ? minimumReturnRate.name : ''}
      />
      <SummaryTable.TextRow
        heading="Time horizon / tenor"
        value={transformArray(timeHorizons)}
      />
      <SummaryTable.TextRow
        heading="Restrictions / conditions"
        value={transformArray(restrictions)}
      />
      <SummaryTable.TextRow
        heading="Construction risk"
        value={transformArray(constructionRisks)}
      />
      <SummaryTable.TextRow
        heading="Minimum equity percentage"
        value={minimumEquityPercentage ? minimumEquityPercentage.name : ''}
      />
      <SummaryTable.TextRow
        heading="Desired deal role"
        value={transformArray(desiredDealRoles)}
      />
    </>
  )
}

export default ProfileRequirementsTable
