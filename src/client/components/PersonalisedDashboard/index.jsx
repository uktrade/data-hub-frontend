import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { BLUE } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { VARIANTS } from '../../../common/constants'
import NotificationBadge from '../NotificationBadge'
import ToggleSection from '../ToggleSection'
import blueTheme from './blue-theme'
import Task from '../Task'
import Aside from './Aside'
import Main from './Main'

import {
  Search,
  Container,
  DashboardTabs,
  InvestmentReminders,
  InvestmentProjectSummary,
} from '../../components'

import {
  MY_INVESTMENTS__LIST_LOADED,
  OUTSTANDING_PROPOSITIONS__LOADED,
  INVESTMENT_SUMMARY_DATA_RANGES__LOADED,
} from '../../actions'

import {
  ID as OUTSTANDING_PROPOSITIONS_ID,
  TASK_GET_OUTSTANDING_PROPOSITIONS,
} from './state'

import {
  ID as INVESTMENT_PROJECT_SUMMARY_DATA_RANGES,
  TASK_GET_INVESTMENT_SUMMARY_DATA_RANGES,
} from '../InvestmentProjectSummary/state'

import {
  ID as MY_INVESTMENT_PROJECTS_ID,
  TASK_GET_MY_INVESTMENTS_LIST,
} from '../MyInvestmentProjects/state'

const state2props = (state) => {
  return {
    investmentProjects: {
      ...state[MY_INVESTMENT_PROJECTS_ID],
    },
    outstandingPropositions: {
      ...state[OUTSTANDING_PROPOSITIONS_ID],
    },
    investmentSummaryDataRanges: {
      ...state[INVESTMENT_PROJECT_SUMMARY_DATA_RANGES],
    },
  }
}

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

const PersonalisedDashboard = ({
  id,
  adviser,
  csrfToken,
  investmentProjects,
  outstandingPropositions,
  investmentSummaryDataRanges,
}) => {
  const { page, filter, sort } = investmentProjects
  const myInvestmentProjectTaskProps = {
    name: TASK_GET_MY_INVESTMENTS_LIST,
    id: MY_INVESTMENT_PROJECTS_ID,
    progressMessage: 'Loading your investment projects',
    startOnRender: {
      payload: {
        adviser,
        page,
        filter,
        sort,
      },
      onSuccessDispatch: MY_INVESTMENTS__LIST_LOADED,
    },
  }
  return (
    <ThemeProvider theme={blueTheme}>
      <SearchBackground data-test="search-data-hub">
        <SearchContainer width="960">
          <Search csrfToken={csrfToken} />
        </SearchContainer>
      </SearchBackground>
      <Container width="1180">
        <GridRow data-test="dashboard">
          <GridCol setWidth="one-third">
            <Aside>
              <ToggleSection
                label="Reminders"
                id="investment-reminders-section"
                badge={
                  !!outstandingPropositions.count && (
                    <NotificationBadge
                      label={`${outstandingPropositions.count}`}
                    />
                  )
                }
                major={true}
                isOpen={true}
                variant={VARIANTS.PRIMARY}
                data-test="investment-reminders-section"
              >
                <Task.Status
                  name={TASK_GET_OUTSTANDING_PROPOSITIONS}
                  id={OUTSTANDING_PROPOSITIONS_ID}
                  progressMessage="Loading your reminders"
                  startOnRender={{
                    payload: { adviser },
                    onSuccessDispatch: OUTSTANDING_PROPOSITIONS__LOADED,
                  }}
                >
                  {() => (
                    <InvestmentReminders
                      outstandingPropositions={outstandingPropositions}
                    />
                  )}
                </Task.Status>
              </ToggleSection>

              <ToggleSection
                label="Investment project summary"
                id="investment-project-summary-section"
                isOpen={true}
                variant={VARIANTS.PRIMARY}
                data-test="investment-project-summary-section"
              >
                <Task.Status
                  name={TASK_GET_INVESTMENT_SUMMARY_DATA_RANGES}
                  id={INVESTMENT_PROJECT_SUMMARY_DATA_RANGES}
                  progressMessage="Loading your investment projects"
                  startOnRender={{
                    payload: { adviser },
                    onSuccessDispatch: INVESTMENT_SUMMARY_DATA_RANGES__LOADED,
                  }}
                >
                  {() => (
                    <InvestmentProjectSummary
                      {...investmentSummaryDataRanges}
                    />
                  )}
                </Task.Status>
              </ToggleSection>
            </Aside>
          </GridCol>

          <GridCol setWidth="two-thirds">
            <Main>
              <DashboardTabs
                id={id}
                investmentProjects={investmentProjects}
                myInvestmentProjectTaskProps={myInvestmentProjectTaskProps}
              />
            </Main>
          </GridCol>
        </GridRow>
      </Container>
    </ThemeProvider>
  )
}

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  investmentProjects: PropTypes.shape({
    results: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    sort: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }).isRequired,
  outstandingPropositions: PropTypes.shape({
    count: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        investment_project: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          project_code: PropTypes.string.isRequired,
        }),
        deadline: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        adviser: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          first_name: PropTypes.string.isRequired,
          last_name: PropTypes.string.isRequired,
        }),
      })
    ).isRequired,
  }),
}

export default connect(state2props)(PersonalisedDashboard)
