import React from 'react'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import { STATUS_VALUES, LIKELIHOOD_VALUES } from './constants'
import urls from '../../../lib/urls'
import { SummaryTable } from '../../../client/components/'
import { WIDTHS } from '@govuk-react/constants'
import { currencyGBP } from '../../../client/utils/number-utils'

const {
  format,
  formatWithoutParsing,
  parseDateString,
} = require('../../../client/utils/date')

function getLabels(acc, { value, label }) {
  acc[value] = label
  return acc
}

const STATUS_LABELS = STATUS_VALUES.reduce(getLabels, {})
const LIKELIHOOD_LABELS = Object.values(LIKELIHOOD_VALUES).reduce(getLabels, {})

const StyledSummaryTable = styled(SummaryTable)`
  width: ${WIDTHS['two-thirds']};
`

function Row(data) {
  if (!data) return null

  const [label, value, href] = data

  return (
    <SummaryTable.Row heading={label} key={label}>
      {href ? <Link href={href}>{value}</Link> : value}
    </SummaryTable.Row>
  )
}

export default function PipelineDetails({ item }) {
  const rows = [
    ['Project name', item.name],
    ['Company', item.company.name, urls.companies.detail(item.company.id)],
    ['Status', STATUS_LABELS[item.status]],
    item.likelihoodToWin && [
      'Export win potential',
      LIKELIHOOD_LABELS[item.likelihoodToWin],
    ],
    item.sector && ['Export sector', item.sector.segment],
    item.contact && [
      'Company contact',
      item.contact.name,
      urls.contacts.details(item.contact.id),
    ],
    item.potentialValue && [
      'Potential export value',
      currencyGBP(item.potentialValue),
    ],
    item.expectedWinDate && [
      'Expected date for win',
      format(item.expectedWinDate, 'MMM y'),
    ],
    ['Created', formatWithoutParsing(parseDateString(item.createdOn))],
    item.archived && ['Reason for archive', item.archivedReason],
    item.archived && [
      'Archived',
      formatWithoutParsing(parseDateString(item.archivedOn)),
    ],
  ]

  return (
    <StyledSummaryTable caption="Project details">
      {rows.map(Row)}
    </StyledSummaryTable>
  )
}
