import React from 'react'
import { connect } from 'react-redux'

import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from './state'
import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../client/actions'

import OpportunityDetails from './OpportunityDetails'

import TabNav from '../../../../client/components/TabNav'
import Task from '../../../../client/components/Task'
import ToggleSection from '../../../../client/components/ToggleSection'

const Opportunities = ({ details }) => (
  <Task.Status
    name={TASK_GET_OPPORTUNITY_DETAILS}
    id={ID}
    startOnRender={{
      payload: 'Replace Me', // TODO pass the id in as a prop
      onSuccessDispatch: INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
    }}
  >
    {() => (
      <TabNav
        id="TabNav"
        label="Dashboard"
        selectedIndex={'details'}
        tabs={{
          details: {
            label: 'Details',
            content: (
              <>
                <ToggleSection label="Opportunity details" id="t.details">
                  <OpportunityDetails
                    // TODO: Reimplement to reflect that the contents of the table row
                    // will be different for different kinds of values (probably pass in React
                    // components as children)
                    details={[
                      details.name,
                      details.description,
                      details.uk_region_locations,
                      details.promoters,
                      details.required_checks_conducted,
                      details.lead_dit_relationship_manager,
                      details.asset_classes,
                      details.opportunity_value,
                      details.construction_risks,
                    ]}
                  />
                </ToggleSection>
                <ToggleSection label="Opportunity requirements" id="t.req" />
              </>
            ),
          },
        }}
      />
    )}
  </Task.Status>
)

// TODO: add PropTypes
export default connect(state2props)(Opportunities)
