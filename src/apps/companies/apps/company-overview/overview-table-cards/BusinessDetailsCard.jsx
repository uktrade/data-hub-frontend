import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import { currencyGBP } from '../../../../../client/utils/number-utils'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
`
const StyledTableRow = styled(Table.Row)`
  border: 0;
`

const BusinessDetailsCard = (props) => {
  const { company, queryString } = props

  const StyledAddressList = styled('ul')``
  return (
    <>
      <StyledSummaryTable
        caption="Business details"
        data-test="businessDetailsContainer"
      >
        <SummaryTable.Row heading="Companies House">
          {!company.company_number ? 'Not set' : company.company_number}
        </SummaryTable.Row>

        <SummaryTable.Row heading="Trading Address">
          {!company.registered_address ? (
            'Not set'
          ) : (
            <StyledAddressList>
              {company.registered_address?.line_1 && (
                <li>{company.registered_address.line_1}</li>
              )}
              {company.registered_address?.line_2 && (
                <li>{company.registered_address.line_2}</li>
              )}
              {company.registered_address?.town && (
                <li>{company.registered_address.town}</li>
              )}
              {company.registered_address?.postcode && (
                <li>{company.registered_address.postcode}</li>
              )}
            </StyledAddressList>
          )}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Website">
          {!company.website ? (
            'Not set'
          ) : (
            <Link href={company.website}>{company.website}</Link>
          )}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Turnover">
          {!company.company_number || !company.turnover_range
            ? 'Not set'
            : company.turnover
            ? currencyGBP(company.turnover, {
                maximumSignificantDigits: 2,
              })
            : company.turnover_range?.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Number of Employees">
          {!company.number_of_employees
            ? 'Not set'
            : company.number_of_employees}
        </SummaryTable.Row>
        <SummaryTable.Row heading="DIT Sector">
          {!company.sector ? 'Not set' : company.sector.name}
        </SummaryTable.Row>
        <StyledTableRow>
          <Table.Cell colSpan={2}>
            <Link href={`${queryString}/business-details`}>
              View full business details
            </Link>
          </Table.Cell>
        </StyledTableRow>
      </StyledSummaryTable>
    </>
  )
}

BusinessDetailsCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default BusinessDetailsCard
