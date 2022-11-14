import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { BLUE } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import Banner from '../LocalHeader/Banner'
import CheckUserFeatureFlag from '../CheckUserFeatureFlags'
import { ID as INVESTMENT_REMINDERS_ID } from '../InvestmentReminders/state'
import { ID as REMINDER_SUMMARY_ID } from '../ReminderSummary/state'
import {
  TASK_CHECK_FOR_INVESTMENTS,
  ID as CHECK_FOR_INVESTMENTS_ID,
  DATA_HUB_FEED_ID,
  TASK_DATA_HUB_FEED,
} from './state'
import {
  MY_INVESTMENTS__CHECK_COMPLETE,
  DATA_HUB_FEED__FETCHED,
} from '../../actions'

import NotificationBadge from '../NotificationBadge'
import { DashboardToggleSection } from '../ToggleSection'
import Task from '../Task'

import Aside from './Aside'
import Main from './Main'
import blueTheme from './blue-theme'

import InvestmentProjectSummary from '../MyInvestmentProjects/InvestmentProjectSummary'
import {
  InvestmentReminders,
  ReminderSummary,
  Search,
  DashboardTabs,
  CustomContainer,
  DataHubFeed,
} from '../../components'

const SearchBackground = styled('div')`
  background-color: ${BLUE};
`

const SearchContainer = styled(CustomContainer)`
  padding: ${SPACING.SCALE_2} 0;

  ${MEDIA_QUERIES.TABLET} {
    padding: ${SPACING.SCALE_3} 0;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    padding: ${SPACING.SCALE_4} 0;
  }
`

const state2props = (state) => {
  const { count: remindersCount } = state[INVESTMENT_REMINDERS_ID]
  const { count: reminderSummaryCount } = state[REMINDER_SUMMARY_ID]
  const { hasInvestmentProjects } = state[CHECK_FOR_INVESTMENTS_ID]
  const { dataHubFeed } = state[DATA_HUB_FEED_ID]
  return {
    hasInvestmentProjects,
    dataHubFeed,
    remindersCount,
    reminderSummaryCount,
  }
}

const PersonalisedDashboard = ({
  id,
  adviser,
  csrfToken,
  remindersCount,
  reminderSummaryCount,
  hasInvestmentProjects,
  dataHubFeed,
}) => (
  <ThemeProvider theme={blueTheme}>
    <Banner items={dataHubFeed} />
    <SearchBackground data-test="search-data-hub">
      <SearchContainer width="960">
        <Search csrfToken={csrfToken} />
      </SearchContainer>
    </SearchBackground>
    <CustomContainer width="1180">
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
                  <CheckUserFeatureFlag userFeatureFlagName="reminder-summary">
                    {(isFeatureFlagOn) =>
                      isFeatureFlagOn ? (
                        <DashboardToggleSection
                          label="Reminders"
                          id="reminder-summary-section"
                          badge={
                            !!reminderSummaryCount && (
                              <NotificationBadge
                                label={`${reminderSummaryCount}`}
                              />
                            )
                          }
                          major={true}
                          isOpen={reminderSummaryCount > 0}
                          data-test="reminder-summary-section"
                        >
                          <ReminderSummary />
                        </DashboardToggleSection>
                      ) : (
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
                      )
                    }
                  </CheckUserFeatureFlag>

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
      <Task.Status
        name={TASK_DATA_HUB_FEED}
        id={DATA_HUB_FEED_ID}
        startOnRender={{
          onSuccessDispatch: DATA_HUB_FEED__FETCHED,
        }}
      >
        {() => (
          <GridRow data-test="data-hub-feed">
            <GridCol setWidth="full">
              <DataHubFeed items={dataHubFeed} feedLimit={1} />
            </GridCol>
          </GridRow>
        )}
      </Task.Status>
    </CustomContainer>
  </ThemeProvider>
)

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  csrfToken: PropTypes.string.isRequired,
  remindersCount: PropTypes.number.isRequired,
  reminderSummaryCount: PropTypes.number.isRequired,
  hasInvestmentProjects: PropTypes.bool.isRequired,
  dataHubFeed: PropTypes.array.isRequired,
}

export default connect(state2props)(PersonalisedDashboard)
