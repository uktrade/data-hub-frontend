import React from 'react'
import PropTypes from 'prop-types'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'

import {
  AccountManagementCard,
  ActiveInvestmentProjectsCard,
  ActivityCard,
  BusinessDetailsCard,
  ExportStatusCard,
  InvestmentStatusCard,
} from '../overview-table-cards'
import { FILTER_FEED_TYPE } from '../../activity-feed/constants'
import { CompanyResource } from '../../../../../client/components/Resource/index'
import CompanyLayout from '../../../../../client/components/Layout/CompanyLayout'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = ({
  companyId,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
}) => (
  <CompanyResource id={companyId}>
    {(company) => (
      <CompanyLayout
        company={company}
        breadcrumbs={[{ text: 'Overview' }]}
        dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
        localNavItems={localNavItems}
        flashMessages={flashMessages}
      >
        <GridRow>
          <GridCol columnOneHalf={true}>
            <CardContainer>
              <BusinessDetailsCard company={company} />
            </CardContainer>
            <CardContainer>
              <AccountManagementCard company={company} />
            </CardContainer>
            <CardContainer>
              <ExportStatusCard company={company} />
            </CardContainer>
            <CardContainer>
              <InvestmentStatusCard companyId={company.id} />
            </CardContainer>
          </GridCol>
          <GridCol columnOneHalf={true}>
            <CardContainer>
              <ActivityCard
                company={company}
                numberOfItems={3}
                feedType={FILTER_FEED_TYPE.RECENT}
              />
            </CardContainer>
            <CardContainer>
              <ActivityCard
                company={company}
                numberOfItems={2}
                feedType={FILTER_FEED_TYPE.UPCOMING}
              />
            </CardContainer>
            <CardContainer>
              <ActiveInvestmentProjectsCard companyId={companyId} />
            </CardContainer>
          </GridCol>
        </GridRow>
      </CompanyLayout>
    )}
  </CompanyResource>
)

CompanyOverview.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default CompanyOverview
