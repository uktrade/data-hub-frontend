/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import Aside from './Aside.jsx'
import Main from './Main.jsx'

import { ID, TASK_USER_DETAILS } from '../PersonalisedDashboard/state'
import { USER_DETAILS_LOADED } from '../../actions'
import Task from '../Task'

import {
  UserDetails,
  InvestmentReminders,
  InvestmentProjectSummary,
  Search,
  InvestmentUpcomingDates,
  DashboardTabs,
  Container,
} from '../../components'

const PersonalisedDashboard = ({ id, adviser }) => {
  /*const userDetailsTask = {
    name: TASK_USER_DETAILS,
    id: ID,
    progressMessage: 'loading projects',
    startOnRender: {
      payload,
      onSuccessDispatch: USER_DETAILS_LOADED,
    },
  }*/
  return (
    <Container>
      <GridRow data-test="dashboard">
        <GridCol setWidth="one-third">
          <Aside>
            <UserDetails
              name={adviser.name}
              last_login={adviser.last_login}
              dit_team={adviser.dit_team}
            />
            <InvestmentReminders />
            <InvestmentProjectSummary />
          </Aside>
        </GridCol>
        <GridCol setWidth="two-thirds">
          <Main>
            <Search />
            <InvestmentUpcomingDates />
            <DashboardTabs id={id} adviser={adviser} />
          </Main>
        </GridCol>
      </GridRow>
    </Container>
  )
}

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default PersonalisedDashboard
