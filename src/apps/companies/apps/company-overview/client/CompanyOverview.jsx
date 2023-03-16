import React from 'react'
import PropTypes from 'prop-types'

import BusinessDetailsCard from '../overview-table-cards/BusinessDetailsCard'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import AccountManagementCard from '../overview-table-cards/AccountManagementCard.jsx'

import ExportStatus from '../overview-table-cards/ExportStatus.jsx'
import InvestmentStatusCard from '../overview-table-cards/InvestmentStatusCard'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = ({ company, companiesHouseLink, investment }) => {
  const queryString = `/companies/${company.id}`
  // console.log('investment: ' + investment)
  // console.log('company: ' + company)

  return (
    <>
      <GridRow>
        <GridCol columnOneHalf={true}>
          <CardContainer>
            <BusinessDetailsCard
              company={company}
              queryString={queryString}
              companiesHouseLink={companiesHouseLink}
            />
          </CardContainer>
          <CardContainer>
            <InvestmentStatusCard
              investment={investment}
              queryString={queryString}
            />
          </CardContainer>
        </GridCol>
        <GridCol columnOneHalf={true}>
          <CardContainer>
            <AccountManagementCard
              company={company}
              queryString={queryString}
            />
          </CardContainer>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol columnOneHalf={true}>
          <CardContainer>
            <ExportStatus company={company} queryString={queryString} />
          </CardContainer>
        </GridCol>
      </GridRow>
    </>
  )
}

CompanyOverview.propTypes = {
  company: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
  companiesHouseLink: PropTypes.string.isRequired,
  investment: PropTypes.object.isRequired,
}

export default CompanyOverview
