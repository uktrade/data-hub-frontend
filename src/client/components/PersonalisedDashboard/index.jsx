import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import Aside from './Aside.jsx'
import Main from './Main.jsx'

import { ID, TASK_GET_USER_DETAILS } from './state'
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
  return (
    <Container>
      <GridRow data-test="dashboard">
        <GridCol setWidth="one-third">
          <Aside>
            <Task.Status
              name={TASK_GET_USER_DETAILS}
              id={ID}
              progressMessage="Loading user details"
              startOnRender={{
                payload: adviser,
                onSuccessDispatch: USER_DETAILS_LOADED,
              }}
            >
              {() => (
                <UserDetails
                  name={adviser.name}
                  last_login={adviser.last_login}
                  dit_team={adviser.dit_team}
                />
              )}
            </Task.Status>
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
  adviser: PropTypes.object.isRequired,
}

export default PersonalisedDashboard
