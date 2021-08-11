import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { BLUE } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { ID as INVESTMENT_REMINDERS_ID } from '../InvestmentReminders/state'
import {
  TASK_CHECK_FOR_INVESTMENTS,
  ID as CHECK_FOR_INVESTMENTS_ID,
} from './state'
import { MY_INVESTMENTS__CHECK_COMPLETE } from '../../actions'

import NotificationBadge from '../NotificationBadge'
import { DashboardToggleSection } from '../ToggleSection'
import Task from '../Task'

import Aside from './Aside'
import Main from './Main'
import blueTheme from './blue-theme'

import {
  InvestmentReminders,
  InvestmentProjectSummary,
  Search,
  DashboardTabs,
  Container,
} from '../../components'

const SearchBackground = styled('div')`
  background-color: ${BLUE};
`

const SearchContainer = styled(Container)`
  padding: ${SPACING.SCALE_2} 0;

  ${MEDIA_QUERIES.TABLET} {
    padding: ${SPACING.SCALE_3} 0;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    padding: ${SPACING.SCALE_4} 0;
  }
`

const state2props = (state) => {
  const { count } = state[INVESTMENT_REMINDERS_ID]
  const { hasInvestmentProjects } = state[CHECK_FOR_INVESTMENTS_ID]
  return {
    hasInvestmentProjects,
    remindersCount: count,
  }
}

const PersonalisedDashboard = ({
  id,
  adviser,
  csrfToken,
  remindersCount,
  hasInvestmentProjects,
}) => (
  <ThemeProvider theme={blueTheme}>
    <SearchBackground data-test="search-data-hub">
      <SearchContainer width="960">
        <Search csrfToken={csrfToken} />
      </SearchContainer>
    </SearchBackground>
    <Container width="1180">
      <Task.Status
        name={TASK_CHECK_FOR_INVESTMENTS}
        id={CHECK_FOR_INVESTMENTS_ID}
        startOnRender={{
          payload: {
            adviser,
          },
          onSuccessDispatch: MY_INVESTMENTS__CHECK_COMPLETE,
        }}
      >
        {() => (
          <GridRow data-test="dashboard">
            {hasInvestmentProjects && (
              <GridCol setWidth="one-third">
                <Aside>
                  <DashboardToggleSection
                    label="Reminders"
                    id="investment-reminders-section"
                    badge={
                      !!remindersCount && (
                        <NotificationBadge label={`${remindersCount}`} />
                      )
                    }
                    major={true}
                    isOpen={false}
                    data-test="investment-reminders-section"
                  >
                    <InvestmentReminders adviser={adviser} />
                  </DashboardToggleSection>

                  <DashboardToggleSection
                    label="Investment projects summary"
                    id="investment-project-summary-section"
                    isOpen={true}
                    data-test="investment-project-summary-section"
                  >
                    <InvestmentProjectSummary adviser={adviser} />
                  </DashboardToggleSection>
                </Aside>
              </GridCol>
            )}
            <GridCol setWidth={hasInvestmentProjects ? 'two-thirds' : 'full'}>
              <Main>
                <DashboardTabs
                  id={id}
                  adviser={adviser}
                  hasInvestmentProjects={hasInvestmentProjects}
                />
              </Main>
            </GridCol>
          </GridRow>
        )}
      </Task.Status>
    </Container>
  </ThemeProvider>
)

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  csrfToken: PropTypes.string.isRequired,
  remindersCount: PropTypes.number.isRequired,
  hasInvestmentProjects: PropTypes.bool.isRequired,
}

export default connect(state2props)(PersonalisedDashboard)
