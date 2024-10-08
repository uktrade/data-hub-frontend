import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { VisuallyHidden } from 'govuk-react'

import NoInvestmentProjects from '../MyInvestmentProjects/NoInvestmentProjects'
import MyInvestmentProjects from '../MyInvestmentProjects'
import CompanyLists from '../CompanyLists'
import LocalHeaderHeading from '../LocalHeader/LocalHeaderHeading'
import ExportList from '../../modules/ExportPipeline/ExportList'
import MyTasks from '../Dashboard/my-tasks/MyTasks'
import urls from '../../../lib/urls'
import TabNav from '../TabNav'
import ReferralList from '../ReferralList'
import { state2props } from './state'
import NoTasks from '../Dashboard/my-tasks/NoTasks'

const StyledDiv = styled('div')`
  padding-top: 16px;
`

const canViewCompanyLists = (permissions) =>
  permissions.includes('company_list.view_companylist')

const canViewReferrals = (permissions) =>
  permissions.includes('company_referral.view_companyreferral')

const DashboardTabs = ({
  id,
  adviser,
  hasInvestmentProjects,
  onTabChange,
  userPermissions,
  hasTasks,
}) => (
  <StyledDiv data-test="dashboard-tabs">
    <VisuallyHidden>
      <LocalHeaderHeading>Dashboard</LocalHeaderHeading>
    </VisuallyHidden>
    <TabNav
      id={`${id}.TabNav`}
      label="Dashboard"
      routed={true}
      keepQueryParams={false}
      onTabChange={onTabChange}
      tabs={{
        [urls.dashboard.myTasks()]: {
          label: 'Tasks',
          content: hasTasks ? <MyTasks adviser={adviser} /> : <NoTasks />,
        },
        ...(canViewCompanyLists(userPermissions) && {
          [urls.dashboard.index()]: {
            label: 'Company lists',
            content: <CompanyLists />,
          },
        }),
        [urls.dashboard.investmentProjects()]: {
          label: 'Investment projects',
          content: hasInvestmentProjects ? (
            <MyInvestmentProjects adviser={adviser} />
          ) : (
            <NoInvestmentProjects />
          ),
        },
        [urls.exportPipeline.index()]: {
          label: 'Export projects',
          content: <ExportList />,
        },
        ...(canViewReferrals(userPermissions) && {
          [urls.companies.referrals.list()]: {
            label: 'Referrals',
            content: <ReferralList id="ReferralList" />,
          },
        }),
      }}
    />
  </StyledDiv>
)

DashboardTabs.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  onTabChange: PropTypes.func,
}

export default connect(state2props)(DashboardTabs)
