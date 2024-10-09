import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { DefaultLayout } from '../../../components'
import OpportunityDetails from './OpportunityDetails'
import OpportunityDetailsHeader from './OpportunityDetailsHeader'
import TabNav from '../../../components/TabNav'
import urls from '../../../../lib/urls'
import Task from '../../../components/Task/index.jsx'
import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from './state'
import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../actions'
import OpportunityInteractions from './OpportunityInteractions'

const StyledMain = styled('div')`
  paddingTop: SPACING.SCALE_5,
  textAlign: 'center',
  margin-top: -30px;
  padding-bottom: 40px;
`

const getCurrentTab = (currentPath) =>
  currentPath.includes('/interactions') ? 'Interactions' : 'Details'

const Opportunity = ({ opportunity }) => {
  const { opportunityId } = useParams()
  const location = useLocation()
  return (
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
          <DefaultLayout
            pageTitle="Investments"
            heading={opportunity.detailsFields.name}
            breadcrumbs={[
              { link: urls.dashboard.index(), text: 'Home' },
              { link: urls.investments.index(), text: 'Investments' },
              {
                link: urls.investments.opportunities.index(),
                text: 'UK opportunities',
              },
              {
                link: urls.investments.opportunities.details(opportunity.id),
                text: opportunity.detailsFields.name,
              },
              { text: getCurrentTab(location.pathname) },
            ]}
            localHeaderChildren={<OpportunityDetailsHeader />}
          >
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
                  [urls.investments.opportunities.interactions(opportunityId)]:
                    {
                      label: 'Interactions',
                      content: (
                        <OpportunityInteractions
                          opportunityId={opportunityId}
                        />
                      ),
                    },
                }}
              />
            </StyledMain>
          </DefaultLayout>
        )
      }
    </Task.Status>
  )
}

Opportunity.propTypes = {
  opportunity: PropTypes.object.isRequired,
}

export default connect(state2props)(Opportunity)
