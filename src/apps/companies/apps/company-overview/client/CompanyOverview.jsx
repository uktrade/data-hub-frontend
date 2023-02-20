import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import { currencyGBP } from '../../../../../client/utils/number-utils'

const CompanyOverview = (props) => {
  const { company } = props

  const queryString = `/companies/${company.id}`

  const StyledAddressList = styled('ul')``
  return (
    <>
      <SummaryTable
        caption="Business Details"
        data-test="documentsDetailsContainer"
      >
        <SummaryTable.Row heading="Companies House">
          {company.company_number}
        </SummaryTable.Row>

        <SummaryTable.Row heading="Trading Address">
          <StyledAddressList>
            {company.registered_address.line_1 && (
              <li>{company.registered_address.line_1}</li>
            )}
            {company.registered_address.line_2 && (
              <li>{company.registered_address.line_2}</li>
            )}
            {company.registered_address.town && (
              <li>{company.registered_address.town}</li>
            )}
            {company.registered_address.postcode && (
              <li>{company.registered_address.postcode}</li>
            )}
          </StyledAddressList>
        </SummaryTable.Row>
        <SummaryTable.Row heading="Website">{company.website}</SummaryTable.Row>
        <SummaryTable.Row heading="Turnover">
          {company.turnover
            ? currencyGBP(company.turnover, {
                maximumSignificantDigits: 2,
              })
            : company.turnover_range.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Number of Employees">
          {company.number_of_employees}
        </SummaryTable.Row>
        <SummaryTable.Row heading="DIT Sector">
          {company.sector.name}
        </SummaryTable.Row>
        <Table.Row>
          <Table.Cell colSpan={2}>
            <Link href={`${queryString}/business-details`}>
              View full business details
            </Link>
          </Table.Cell>
        </Table.Row>
      </SummaryTable>
    </>
  )
}

CompanyOverview.propTypes = {
  company: PropTypes.object.isRequired,
}

export default CompanyOverview
