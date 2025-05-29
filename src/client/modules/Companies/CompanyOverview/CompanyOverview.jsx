import React from 'react'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import {
  AccountManagementCard,
  ActiveInvestmentProjectsCard,
  BusinessDetailsCard,
  ExportStatusCard,
  InvestmentStatusCard,
  RecentActivityCard,
  UpcomingActivityCard,
  AccoladesCard,
} from './TableCards'
import { CompanyResource } from '../../../components/Resource/index'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'
import PromptPaymentsCard from './TableCards/PromptPaymentsCard'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = () => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
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
                  <InvestmentStatusCard companyId={companyId} />
                </CardContainer>
                <PromptPaymentsCard companyId={companyId} />
              </GridCol>
              <GridCol columnOneHalf={true}>
                <AccoladesCard companyId={companyId} />
                <CardContainer>
                  <RecentActivityCard company={company} />
                </CardContainer>
                <CardContainer>
                  <UpcomingActivityCard company={company} />
                </CardContainer>
                <CardContainer>
                  <ActiveInvestmentProjectsCard companyId={companyId} />
                </CardContainer>
              </GridCol>
            </GridRow>
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default CompanyOverview
