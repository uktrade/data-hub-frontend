import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { BLUE, MID_BLUE } from '../../../client/utils/colours'
import {
  readFromLocalStorage,
  writeToLocalStorage,
  DASHBOARD_TAB,
} from '../../../client/utils/localStorage'
import Banner from '../LocalHeader/Banner'
import {
  TASK_CHECK_FOR_INVESTMENTS,
  ID as CHECK_FOR_INVESTMENTS_ID,
  DATA_HUB_FEED_ID,
  TASK_DATA_HUB_FEED,
  CHECK_FOR_MY_TASKS_ID,
  TASK_CHECK_FOR_MY_TASKS,
} from './state'
import {
  MY_INVESTMENTS__CHECK_COMPLETE,
  DATA_HUB_FEED__FETCHED,
  MY_TASKS_CHECK_COMPLETE,
} from '../../actions'

import Task from '../Task'

import Main from './Main'
import blueTheme from './blue-theme'

import {
  Search,
  DashboardTabs,
  CustomContainer,
  DataHubFeed,
} from '../../components'
import FlashMessages from '../LocalHeader/FlashMessages'

const SearchBackground = styled('div')`
  background-color: ${BLUE};
`

const BannerBackground = styled('div')`
  background-color: ${MID_BLUE};
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
  const { hasInvestmentProjects } = state[CHECK_FOR_INVESTMENTS_ID]
  const { hasTasks } = state[CHECK_FOR_MY_TASKS_ID]
  const { dataHubFeed } = state[DATA_HUB_FEED_ID]

  return {
    hasInvestmentProjects,
    dataHubFeed,
    hasTasks,
  }
}

const PersonalisedDashboard = ({
  id,
  adviser,
  csrfToken,
  hasInvestmentProjects,
  dataHubFeed,
  hasTasks,
}) => {
  const navigate = useNavigate()

  const previouslySelectedTabPath = readFromLocalStorage(DASHBOARD_TAB)

  if (
    previouslySelectedTabPath &&
    previouslySelectedTabPath !== window.location.pathname
  ) {
    navigate(previouslySelectedTabPath)
  }

  return (
    <ThemeProvider theme={blueTheme}>
      <BannerBackground>
        <CustomContainer width="960">
          <Banner items={dataHubFeed} />
        </CustomContainer>
      </BannerBackground>
      <SearchBackground data-test="search-data-hub">
        <SearchContainer width="960">
          <Search csrfToken={csrfToken} />
        </SearchContainer>
      </SearchBackground>
      <CustomContainer width="1180">
        <FlashMessages />
        <Task.Status
          name={TASK_CHECK_FOR_MY_TASKS}
          id={CHECK_FOR_MY_TASKS_ID}
          startOnRender={{
            payload: {
              adviser,
            },
            onSuccessDispatch: MY_TASKS_CHECK_COMPLETE,
          }}
        />
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
              <GridCol setWidth="full">
                <Main>
                  <DashboardTabs
                    id={id}
                    adviser={adviser}
                    hasInvestmentProjects={hasInvestmentProjects}
                    onTabChange={({ path }) =>
                      writeToLocalStorage(DASHBOARD_TAB, path)
                    }
                    hasTasks={hasTasks}
                  />
                </Main>
              </GridCol>
            </GridRow>
          )}
        </Task.Status>
        <aside>
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
                  <DataHubFeed
                    items={dataHubFeed}
                    feedLimit={1}
                    isPersonalisedDashboard={true}
                  />
                </GridCol>
              </GridRow>
            )}
          </Task.Status>
        </aside>
      </CustomContainer>
    </ThemeProvider>
  )
}

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  csrfToken: PropTypes.string.isRequired,
  hasInvestmentProjects: PropTypes.bool.isRequired,
  hasTasks: PropTypes.bool.isRequired,
  dataHubFeed: PropTypes.array.isRequired,
}

export default connect(state2props)(PersonalisedDashboard)
