import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import { Main } from '../../../../../client/components'
import OpportunityDetails from './OpportunityDetails'
import OpportunityDetailsHeader from './OpportunityDetailsHeader'
import TabNav from '../../../../../client/components/TabNav'
import urls from '../../../../../lib/urls'
import Task from '../../../../../client/components/Task/index.jsx'
import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from './state'
import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../../client/actions'
import OpportunityInteractions from './OpportunityInteractions'
import styled from 'styled-components'

const StyledMain = styled(Main)`
  padding-bottom: 40px;
`

const Opportunity = ({ opportunityId, opportunity }) => (
  <Route>
    {({ location }) => (
      <Task.Status
        name={TASK_GET_OPPORTUNITY_DETAILS}
        id={ID}
        progressMessage="Loading opportunity"
        startOnRender={{
          payload: {
            opportunityId,
          },
          onSuccessDispatch: INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
        }}
      >
        {() =>
          opportunity.detailsFields.name && (
            <>
              <OpportunityDetailsHeader currentPath={location.pathname} />
              <StyledMain>
                <TabNav
                  id="opportunity-tab-nav"
                  label="Opportunity tab nav"
                  routed={true}
                  tabs={{
                    [urls.investments.opportunities.details(opportunityId)]: {
                      label: 'Details',
                      content: (
                        <OpportunityDetails opportunityId={opportunityId} />
                      ),
                    },
                    [urls.investments.opportunities.interactions(
                      opportunityId
                    )]: {
                      label: 'Interactions',
                      content: (
                        <OpportunityInteractions
                          opportunityId={opportunityId}
                        />
                      ),
                    },
                  }}
                ></TabNav>
              </StyledMain>
            </>
          )
        }
      </Task.Status>
    )}
  </Route>
)

Opportunity.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  opportunity: PropTypes.object.isRequired,
}

export default connect(state2props)(Opportunity)
