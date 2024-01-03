import React from 'react'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

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
import CompanyLayoutNew from '../../../../../client/components/Layout/CompanyLayoutNew'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <CompanyLayoutNew
          company={company}
          breadcrumbs={[{ text: 'Overview' }]}
          pageTitle="Overview"
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
        </CompanyLayoutNew>
      )}
    </CompanyResource>
  )
}

export default CompanyOverview
