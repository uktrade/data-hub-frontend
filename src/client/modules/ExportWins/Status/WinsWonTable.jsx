import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Table, Link } from 'govuk-react'
import styled from 'styled-components'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import { WIN_FILTERS } from './constants'
import urls from '../../../../lib/urls'

const NoWrapCell = styled(Table.Cell)`
  white-space: nowrap;
`

export const WinsWonTable = ({ exportWins }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>UK Company</Table.CellHeader>
        <Table.CellHeader>Destination</Table.CellHeader>
        <Table.CellHeader>Export amount</Table.CellHeader>
        <Table.CellHeader>Date won</Table.CellHeader>
        <Table.CellHeader>Date responded</Table.CellHeader>
        <Table.CellHeader>Details</Table.CellHeader>
      </Table.Row>
    }
  >
    {exportWins.map(
      ({
        id,
        company,
        country,
        date,
        total_expected_export_value,
        created_on,
      }) => (
        <Table.Row key={id}>
          <Table.Cell>
            <Link
              as={ReactRouterLink}
              to={urls.companies.overview.index(company.id)}
            >
              {company.name}
            </Link>
          </Table.Cell>
          <Table.Cell>{country.name}</Table.Cell>
          <Table.Cell>{currencyGBP(total_expected_export_value)}</Table.Cell>
          <NoWrapCell>{formatMediumDate(date)}</NoWrapCell>
          <NoWrapCell>{formatMediumDate(created_on)}</NoWrapCell>
          <NoWrapCell>
            <Link
              as={ReactRouterLink}
              to={urls.companies.exportWins.details(id)}
            >
              View details
            </Link>
          </NoWrapCell>
        </Table.Row>
      )
    )}
  </Table>
)

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-won"
    payload={{ confirmed: WIN_FILTERS.WON }}
  >
    {(page) => <WinsWonTable exportWins={page} />}
  </ExportWinsResource.Paginated>
)
