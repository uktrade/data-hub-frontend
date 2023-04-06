import React from 'react'
import PropTypes from 'prop-types'
import AccountManagementCard from '../overview-table-cards/AccountManagementCard.jsx'
import ActivityCard from '../overview-table-cards/ActivityCard'
import BusinessDetailsCard from '../overview-table-cards/BusinessDetailsCard'
import ActiveInvestmentProjectsCard from '../overview-table-cards/ActiveInvestmentProjectsCard.jsx'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import InvestmentStatusCard from '../overview-table-cards/InvestmentStatusCard'

import ExportStatus from '../overview-table-cards/ExportStatus.jsx'
import { FILTER_FEED_TYPE } from '../../activity-feed/constants'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = ({
  company,
  companiesHouseLink,
  exportCountriesInformation,
  futureInterestCountries,
}) => {
  const queryString = `/companies/${company.id}`
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
            <AccountManagementCard
              company={company}
              queryString={queryString}
            />
          </CardContainer>
          <CardContainer>
            <ExportStatus
              company={company}
              queryString={queryString}
              exportCountriesInformation={exportCountriesInformation}
              futureInterestCountries={futureInterestCountries}
            />
          </CardContainer>
          <CardContainer>
            <InvestmentStatusCard
              companyId={company.id}
              queryString={queryString}
            />
          </CardContainer>
        </GridCol>
        <GridCol columnOneHalf={true}>
          <CardContainer>
            <ActivityCard
              company={company}
              queryString={queryString}
              numberOfItems={3}
              feedType={FILTER_FEED_TYPE.RECENT}
            />
          </CardContainer>
          <CardContainer>
            <ActivityCard
              company={company}
              queryString={queryString}
              numberOfItems={2}
              feedType={FILTER_FEED_TYPE.UPCOMING}
            />
          </CardContainer>
          <CardContainer>
            <ActiveInvestmentProjectsCard queryString={queryString} />
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
