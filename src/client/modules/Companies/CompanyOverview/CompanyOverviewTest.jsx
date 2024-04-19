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
} from './TableCards'
import { FILTER_FEED_TYPE } from '../../../../apps/companies/apps/activity-feed/constants'
import { CompanyResource } from '../../../components/Resource/index'
import {
  CompanyLayoutNew,
  CompanyTabbedLocalNavigation,
} from '../../../components'
import urls from '../../../../lib/urls'
import CompanyInvestmentSubNavigation from '../../../components/CompanyTabbedLocalNavigation/CompanyInvestmentTab'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyName = (props) => (
  <CompanyResource.Inline {...props}>
    {(company) => company.name}
  </CompanyResource.Inline>
)

const CompanyOverview = ({ isInvestment = false, isLCP = false }) => {
  const { companyId } = useParams()

  return (
    <CompanyLayoutNew
      pageTitle={
        <>
          Overview - <CompanyName id={companyId} /> - Companies - DBT Data Hub
        </>
      }
      breadcrumbs={[
        {
          link: urls.companies.detail(companyId),
          text: 'company name',
        },
        { text: 'Overview' },
      ]}
      companyId={companyId}
    >
      <CompanyResource id={companyId}>
        {(company) => (
          <>
            <CompanyTabbedLocalNavigation company={company} />
            {isInvestment && (
              <CompanyInvestmentSubNavigation
                companyId={company.id}
                isLCP={isLCP}
              />
            )}
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
          </>
        )}
      </CompanyResource>
    </CompanyLayoutNew>
  )
  // return (
  // <DefaultLayoutBase>
  //   <CompanyResource id={companyId}>
  //     {(company) => (
  //       <CompanyLayout
  //         company={company}
  //         breadcrumbs={[{ text: 'Overview' }]}
  //         pageTitle="Overview"
  //       >
  //         <GridRow>
  //           <GridCol columnOneHalf={true}>
  //             <CardContainer>
  //               <BusinessDetailsCard company={company} />
  //             </CardContainer>
  //             <CardContainer>
  //               <AccountManagementCard company={company} />
  //             </CardContainer>
  //             <CardContainer>
  //               <ExportStatusCard company={company} />
  //             </CardContainer>
  //             <CardContainer>
  //               <InvestmentStatusCard companyId={company.id} />
  //             </CardContainer>
  //           </GridCol>
  //           <GridCol columnOneHalf={true}>
  //             <CardContainer>
  //               <ActivityCard
  //                 company={company}
  //                 numberOfItems={3}
  //                 feedType={FILTER_FEED_TYPE.RECENT}
  //               />
  //             </CardContainer>
  //             <CardContainer>
  //               <ActivityCard
  //                 company={company}
  //                 numberOfItems={2}
  //                 feedType={FILTER_FEED_TYPE.UPCOMING}
  //               />
  //             </CardContainer>
  //             <CardContainer>
  //               <ActiveInvestmentProjectsCard companyId={companyId} />
  //             </CardContainer>
  //           </GridCol>
  //         </GridRow>
  //       </CompanyLayout>
  //     )}
  //   </CompanyResource>
  // </DefaultLayoutBase>
  // )
}

export default CompanyOverview
