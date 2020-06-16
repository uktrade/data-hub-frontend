import React from 'react'
import { SummaryTable, NumberUtils, DateUtils } from 'data-hub-components'
import Link from '@govuk-react/link'
import moment from 'moment'
import styled from 'styled-components'

import { STATUS_VALUES, LIKELIHOOD_VALUES } from './constants'
import urls from '../../../lib/urls'
import { WIDTHS } from '@govuk-react/constants/lib/spacing'

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
    ['Project status', STATUS_LABELS[item.status]],
    item.likelihood_to_win && [
      'Export win potential',
      LIKELIHOOD_LABELS[item.likelihood_to_win],
    ],
    item.sector && ['Project sector', item.sector.segment],
    item.contact && [
      'Company contact',
      item.contact.name,
      urls.contacts.details(item.contact.id),
    ],
    item.potential_value && [
      'Potential export value',
      NumberUtils.currencyGBP(item.potential_value),
    ],
    item.expected_win_date && [
      'Expected date for win',
      moment(item.expected_win_date).format('MMM Y'),
    ],
    ['Created on', DateUtils.formatWithTime(item.created_on)],
  ]

  return (
    <StyledSummaryTable caption="Project details">
      {rows.map(Row)}
    </StyledSummaryTable>
  )
}
