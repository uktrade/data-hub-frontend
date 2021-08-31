import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import NoInvestmentProjects from '../MyInvestmentProjects/NoInvestmentProjects'
import MyInvestmentProjects from '../MyInvestmentProjects'
import CompanyLists from '../CompanyLists'
import urls from '../../../lib/urls'
import TabNav from '../TabNav'

const StyledDiv = styled('div')`
  padding-top: 16px;
`

const DashboardTabs = ({ id, adviser, hasInvestmentProjects }) => (
  <StyledDiv data-test="dashboard-tabs">
    <TabNav
      id={`${id}.TabNav`}
      label="Dashboard"
      routed={true}
      keepQueryParams={true}
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
      }}
    />
  </StyledDiv>
)

DashboardTabs.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
}

export default DashboardTabs
