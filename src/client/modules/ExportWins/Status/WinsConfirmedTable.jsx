import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Table, Link } from 'govuk-react'
import styled from 'styled-components'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import { sumExportValues } from './utils'
import { SORT_OPTIONS, WIN_STATUS } from './constants'
import urls from '../../../../lib/urls'

const NoWrapCell = styled(Table.Cell)`
  white-space: nowrap;
`

export const WinsConfirmedTable = ({ exportWins = [] }) => {
  return exportWins.length === 0 ? null : (
    <Table
      head={
        <Table.Row>
          <Table.CellHeader>UK Company</Table.CellHeader>
          <Table.CellHeader>Destination</Table.CellHeader>
          <Table.CellHeader>Total value</Table.CellHeader>
          <Table.CellHeader>Date won</Table.CellHeader>
          <Table.CellHeader>Date responded</Table.CellHeader>
          <Table.CellHeader>Details</Table.CellHeader>
        </Table.Row>
      }
    >
      {exportWins.map((item) => (
        <Table.Row key={item.id}>
          <Table.Cell>
            <Link
              as={ReactRouterLink}
              to={urls.companies.overview.index(item.company.id)}
            >
              {item.company.name}
            </Link>
          </Table.Cell>
          <Table.Cell>{item.country.name}</Table.Cell>
          <Table.Cell data-test="sum-total-value">
            {currencyGBP(sumExportValues(item))}
          </Table.Cell>
          <NoWrapCell>{formatMediumDate(item.date)}</NoWrapCell>
          <NoWrapCell>
            {formatMediumDate(item.customer_response.responded_on)}
          </NoWrapCell>
          <NoWrapCell>
            <Link
              as={ReactRouterLink}
              to={urls.companies.exportWins.editSummary(
                item.company.id,
                item.id
              )}
            >
              View details
            </Link>
          </NoWrapCell>
        </Table.Row>
      ))}
    </Table>
  )
}

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-confirmed"
    heading="confirmed"
    shouldPluralize={false}
    noResults="You don't have any confirmed export wins."
    payload={{ confirmed: WIN_STATUS.CONFIRMED }}
    sortOptions={SORT_OPTIONS}
  >
    {(page) => <WinsConfirmedTable exportWins={page} />}
  </ExportWinsResource.Paginated>
)
