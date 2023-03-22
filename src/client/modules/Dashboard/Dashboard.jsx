import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import { DataHubFeed, Main, SearchLocalHeader } from '../../components'
import Task from '../../components/Task'
import {
  TASK_DATA_HUB_FEED,
  DATA_HUB_FEED_ID,
} from '../../components/PersonalisedDashboard/state'
import { DATA_HUB_FEED__FETCHED } from '../../actions'
import { GREY_2 } from '../../utils/colours'
import urls from '../../../lib/urls'
import CompanyLists from '../../components/CompanyLists'
import ReferralList from '../../components/ReferralList'
import Pipeline from '../../components/Pipeline'
import ExportList from '../../modules/ExportPipeline/ExportList'
import TabNav from '../../components/TabNav'

const StyledDiv = styled('div')`
  border-top: 4px solid ${GREY_2};
  padding-top: 16px;
  padding-bottom: 30px;
`

const state2props = (state) => {
  const { dataHubFeed } = state[DATA_HUB_FEED_ID]
  const hasExportPipeline = state.activeFeatures.includes('export-pipeline')

  return { dataHubFeed, hasExportPipeline }
}

const Dashboard = ({
  csrfToken,
  flashMessages,
  dashboardTabId,
  userPermissions,
  dataHubFeed,
  hasExportPipeline,
}) => {
  const canViewDashboardTabs = userPermissions.includes(
    'company_list.view_companylist'
  )
  return (
    <>
      <SearchLocalHeader csrfToken={csrfToken} flashMessages={flashMessages} />
      <Main>
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
                  isPersonalisedDashboard={false}
                />
              </GridCol>
            </GridRow>
          )}
        </Task.Status>
        {canViewDashboardTabs && (
          <StyledDiv data-test="dashboard-tabs">
            <TabNav
              id={`${dashboardTabId}.TabNav`}
              label="Dashboard"
              routed={true}
              tabs={{
                [urls.dashboard.mountPoint]: {
                  label: 'My companies lists',
                  content: <CompanyLists />,
                },
                [urls.companies.referrals.list.mountPoint]: {
                  label: 'My referrals',
                  content: (
                    <ReferralList id={`${dashboardTabId}:ReferralList`} />
                  ),
                },
                ...(hasExportPipeline
                  ? {
                      [urls.exportPipeline.index()]: {
                        label: 'Export list',
                        content: <ExportList />,
                      },
                    }
                  : {
                      [urls.pipeline.index.mountPoint]: {
                        label: 'My pipeline',
                        content: <Pipeline />,
                      },
                    }),
              }}
            />
          </StyledDiv>
        )}
      </Main>
    </>
  )
}

Dashboard.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  flashMessages: PropTypes.string,
  dashboardTabId: PropTypes.string.isRequired,
  userPermissions: PropTypes.array.isRequired,
  dataHubFeed: PropTypes.array.isRequired,
}

export default connect(state2props)(Dashboard)
