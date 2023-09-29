import React from 'react'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import SummaryTable from '../../../../../client/components/SummaryTable'
import Tag from '../../../../../client/components/Tag'

const StyledTag = styled(Tag)`
  float: right;
`

const OpportunityDetailsTable = ({ details }) => {
  const {
    name,
    description,
    ukRegions,
    promoters,
    requiredChecksConducted,
    leadRelationshipManager,
    otherDitContacts,
    assetClasses,
    opportunityValue,
    constructionRisks,
  } = details

  return (
    <>
      <SummaryTable.TextRow heading="Opportunity name" value={name} />
      <SummaryTable.TextRow
        heading="Opportunity description"
        value={description}
      />
      <SummaryTable.ListRow heading="UK location" value={ukRegions} />
      <SummaryTable.Row heading="Promoters">
        {promoters.length ? (
          <ul>
            {promoters.map((v, i) => (
              <li key={`Promoters-${i}`}>
                <Link href={`/companies/${v.value}`}>{v.label}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <StyledTag>incomplete</StyledTag>
        )}
      </SummaryTable.Row>
      <SummaryTable.TextRow
        heading="Has this opportunity cleared the required checks?"
        value={requiredChecksConducted.label}
      />
      <SummaryTable.TextRow
        heading="Lead DBT relationship manager"
        value={leadRelationshipManager.label}
      />
      <SummaryTable.ListRow
        heading="Other DBT contacts"
        value={otherDitContacts}
      />
      <SummaryTable.ListRow heading="Asset classes" value={assetClasses} />
      <SummaryTable.CurrencyRow
        heading={opportunityValue.label}
        value={parseInt(opportunityValue.value)}
      />
      <SummaryTable.ListRow
        heading="Construction risk"
        value={constructionRisks}
      />
    </>
  )
}

export default OpportunityDetailsTable
