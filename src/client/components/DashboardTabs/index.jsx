import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import CompanyLists from '../CompanyLists'
import MyInvestmentProjects from '../MyInvestmentProjects'
import TabNav from '../TabNav'

const StyledDiv = styled('div')`
  padding-top: 16px;
`

const DashboardTabs = ({
  id,
  investmentProjects,
  myInvestmentProjectTaskProps,
}) => {
  return (
    <StyledDiv data-cy="dashboard-tabs">
      <TabNav
        id={`${id}.TabNav`}
        label="Dashboard"
        routed={true}
        tabs={{
          [urls.personalisedDashboard.myInvestmentProjects()]: {
            label: 'My projects',
            content: (
              <MyInvestmentProjects
                myInvestmentProjectTaskProps={myInvestmentProjectTaskProps}
                {...investmentProjects}
              />
            ),
          },
          [urls.dashboard()]: {
            label: 'My companies lists',
            content: <CompanyLists />,
          },
        }}
      />
    </StyledDiv>
  )
}

DashboardTabs.propTypes = {
  id: PropTypes.string.isRequired,
  investmentProjects: PropTypes.shape({
    results: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    sort: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }),
}

export default DashboardTabs
