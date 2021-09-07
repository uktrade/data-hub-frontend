import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { Main } from '../../../../../client/components'
import Opportunities from './Opportunities'
import OpportunityDetailsHeader from './OpportunityDetailsHeader'
import TabNav from '../../../../../client/components/TabNav'
import urls from '../../../../../lib/urls'
import Task from '../../../../../client/components/Task/index.jsx'
import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from '../Details/state'
import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../../client/actions'

const OpportunityTabNav = ({ opportunityId, opportunity }) => (
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
          <OpportunityDetailsHeader />
          <Main>
            <TabNav
              id="opportunity-tab-nav"
              label="Opportunity tab nav"
              routed={true}
              tabs={{
                [urls.investments.opportunities.opportunity(opportunityId)]: {
                  label: 'Details',
                  content: <Opportunities opportunityId={opportunityId} />,
                },
              }}
            ></TabNav>
          </Main>
        </>
      )
    }
  </Task.Status>
)

OpportunityTabNav.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  opportunity: PropTypes.object.isRequired,
}

export default connect(state2props)(OpportunityTabNav)
