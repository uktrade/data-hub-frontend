import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import UserDetails from '../UserDetails'
import InvestmentReminders from '../InvestmentReminders'
import InvestmentProjectSummary from '../InvestmentProjectSummary'
import Search from '../Search'
import InvestmentUpcomingDates from '../InvestmentUpcomingDates'
import DashboardTabs from '../DashboardTabs'

const PersonalisedDashboard = ({ id }) => (
  <GridRow data-test="dashboard">
    <GridCol setWidth="one-third">
      <UserDetails />
      <InvestmentReminders />
      <InvestmentProjectSummary />
    </GridCol>
    <GridCol setWidth="two-thirds">
      <Search />
      <InvestmentUpcomingDates />
      <DashboardTabs id={id} />
    </GridCol>
  </GridRow>
)

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default PersonalisedDashboard
