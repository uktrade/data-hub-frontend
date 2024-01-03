import React from 'react'
import PropTypes from 'prop-types'
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
} from './TableCards'
import { FILTER_FEED_TYPE } from '../../../../apps/companies/apps/activity-feed/constants'
import { CompanyResource } from '../../../components/Resource/index'
import CompanyLayoutNew from '../../../components/Layout/CompanyLayoutNew'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = ({ flashMessages }) => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase pageTitle="Overview - Companies">
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayoutNew
            company={company}
            breadcrumbs={[{ text: 'Overview' }]}
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
          </CompanyLayoutNew>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

CompanyOverview.propTypes = {
  flashMessages: PropTypes.object,
}

export default CompanyOverview
