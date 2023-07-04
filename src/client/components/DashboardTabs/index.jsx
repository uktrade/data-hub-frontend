import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import NoInvestmentProjects from '../MyInvestmentProjects/NoInvestmentProjects'
import MyInvestmentProjects from '../MyInvestmentProjects'
import CompanyLists from '../CompanyLists'
import ExportList from '../../modules/ExportPipeline/ExportList'
import urls from '../../../lib/urls'
import TabNav from '../TabNav'
import ReferralList from '../ReferralList'

const StyledDiv = styled('div')`
  padding-top: 16px;
`

const DashboardTabs = ({ id, adviser, hasInvestmentProjects, onTabChange }) => (
  <StyledDiv data-test="dashboard-tabs">
    <TabNav
      id={`${id}.TabNav`}
      label="Dashboard"
      routed={true}
      keepQueryParams={false}
      onTabChange={onTabChange}
      tabs={{
        [urls.dashboard()]: {
          label: 'Investment projects',
          content: hasInvestmentProjects ? (
            <MyInvestmentProjects adviser={adviser} />
          ) : (
            <NoInvestmentProjects />
          ),
        },
        [urls.companyLists.index()]: {
          label: 'Company lists',
          content: <CompanyLists />,
        },
        [urls.exportPipeline.index()]: {
          label: 'Export list',
          content: <ExportList />,
        },
        [urls.companies.referrals.list()]: {
          label: 'My referrals',
          content: <ReferralList id="ReferralList" />,
        },
      }}
    />
  </StyledDiv>
)

DashboardTabs.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  onTabChange: PropTypes.func,
}

export default DashboardTabs
