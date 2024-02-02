import React from 'react'
import { Table, Link } from 'govuk-react'
import styled from 'styled-components'
import { Link as ReactRouterLink } from 'react-router-dom/cjs/react-router-dom'

import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import ExportWinsResource from '../../../components/Resource/ExportWins'
import urls from '../../../../lib/urls'

const NoWrapCell = styled(Table.Cell)`
  white-space: nowrap;
`

export const ExportWinsTable = ({ exportWins }) => (
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
        customer_response,
        total_expected_export_value,
      }) => (
        <Table.Row key={id}>
          <Table.Cell>
            <Link as={ReactRouterLink} to={urls.companies.detail(company.id)}>
              {company.name}
            </Link>
          </Table.Cell>
          <Table.Cell>{country.name}</Table.Cell>
          <Table.Cell>{currencyGBP(total_expected_export_value)}</Table.Cell>
          <NoWrapCell>{formatMediumDate(date)}</NoWrapCell>
          <NoWrapCell>
            {formatMediumDate(customer_response?.created_on)}
          </NoWrapCell>
          <NoWrapCell>
            {/* TODO: Add target to the link once the path is decided */}
            <Link as={ReactRouterLink}>View details</Link>
          </NoWrapCell>
        </Table.Row>
      )
    )}
  </Table>
)

export default () => (
  <ExportWinsResource.Paginated
    id="unconfirmed-export-wins"
    payload={{ filter: 'confirmed' }}
  >
    {(page) => <ExportWinsTable exportWins={page} />}
  </ExportWinsResource.Paginated>
)
