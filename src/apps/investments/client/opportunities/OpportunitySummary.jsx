import React from 'react'

import SummaryTable from '../../../../client/components/SummaryTable'
import Tag from '../../../../client/components/Tag'

import { currencyGBP } from '../../../../client/utils/number-utils'

import Link from '@govuk-react/link'
import styled from 'styled-components'

const StyledTag = styled(Tag)`
  float: right;
`

const TextRow = ({ data }) => (
  <SummaryTable.Row heading={data.label}>
    {data.value ? data.value : <StyledTag>incomplete</StyledTag>}
  </SummaryTable.Row>
)

const CurrencyRow = ({ data }) => (
  <SummaryTable.Row heading={data.label}>
    {data.value ? currencyGBP(data.value) : <StyledTag>incomplete</StyledTag>}
  </SummaryTable.Row>
)

const ListRow = ({ data }) => (
  <SummaryTable.Row heading={data.label}>
    {data.value.length ? (
      <ul>
        {data.value.map((v) => (
          <li>{v}</li>
        ))}
      </ul>
    ) : (
      <StyledTag>incomplete</StyledTag>
    )}
  </SummaryTable.Row>
)

export const OpportunityDetails = ({ details }) => {
  const {
    name,
    description,
    ukRegions,
    promoters,
    requiredChecks,
    leadRelationshipManager,
    assetClasses,
    value,
    constructionRisks,
  } = details

  return (
    <>
      <TextRow data={name} />
      <TextRow data={description} />
      <ListRow data={ukRegions} />
      <SummaryTable.Row heading={promoters.label}>
        {promoters.value.length ? (
          <ul>
            {promoters.value.map((v) => (
              <li>
                <Link href={`/companies/${v.id}`}>{v.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <StyledTag>incomplete</StyledTag>
        )}
      </SummaryTable.Row>
      <TextRow data={requiredChecks} />
      <TextRow data={leadRelationshipManager} />
      <ListRow data={assetClasses} />
      <CurrencyRow data={value} />
      <ListRow data={constructionRisks} />
    </>
  )
}
