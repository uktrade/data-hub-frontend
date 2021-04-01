import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TASK_GET_OPPORTUNITY_DETAILS, ID, state2props } from './state'
import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../client/actions'

import OpportunityDetails from './OpportunityDetails'
import OpportunityRequirements from './OpportunityRequirements'

import Task from '../../../../client/components/Task'
import TabNav from '../../../../client/components/TabNav'
import ToggleSection from '../../../../client/components/ToggleSection'
import SummaryTable from '../../../../client/components/SummaryTable'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import styled from 'styled-components'
import { HIGHLIGHT_COLOUR, RED, GREEN } from 'govuk-colours'
import Link from '@govuk-react/link'

import { VARIANTS } from '../../../../common/constants'

const StyledSpan = styled('span')`
  background: ${HIGHLIGHT_COLOUR};
`

const StyledToggle = styled(ToggleSection)`
  font-size: ${FONT_SIZE.SIZE_14};
  margin-top: ${SPACING.SCALE_4};
`

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 19px;
  float: right;
  margin: 5px;
  color: ${(props) => props.color};
`

const RequiredFields = (fieldCount) => {
  if (fieldCount == 0) {
    return <StyledLabel color={GREEN}>Completed</StyledLabel>
  }
  return <StyledLabel color={RED}>{fieldCount} fields required</StyledLabel>
}

const OpportunitySection = ({
  incompleteFields,
  toggleName,
  toggleId,
  children,
}) => (
  <>
    {RequiredFields(incompleteFields)}
    <ToggleSection
      variant={VARIANTS.SECONDARY}
      label={toggleName}
      id={toggleId}
    >
      {/* TODO: add an 'isEditing' conditional to display forms */}
      <SummaryTable>{children}</SummaryTable>
    </ToggleSection>
  </>
)

const Opportunities = ({ opportunityId, details }) => {
  const {
    detailsFields,
    requirementsFields,
    incompleteDetailsFields,
    incompleteRequirementsFields,
  } = details
  return (
    <Task.Status
      name={TASK_GET_OPPORTUNITY_DETAILS}
      id={ID}
      startOnRender={{
        payload: opportunityId,
        onSuccessDispatch: INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
      }}
    >
      {() => (
        <>
          <TabNav
            id="Opportunity.tabnav"
            label="Dashboard"
            selectedIndex={'details'}
            tabs={{
              details: {
                label: 'Details',
                content: (
                  <>
                    <OpportunitySection
                      incompleteFields={incompleteDetailsFields}
                      children={<OpportunityDetails details={detailsFields} />}
                      toggleName="Opportunity details"
                      toggleId="opportunity_details_toggle"
                    />
                    <OpportunitySection
                      incompleteFields={incompleteRequirementsFields}
                      children={
                        <OpportunityRequirements details={requirementsFields} />
                      }
                      toggleName="Opportunity requirements"
                      toggleId="opportunity_requirements_toggle"
                    />
                  </>
                ),
              },
            }}
          />
          <StyledToggle
            variant={VARIANTS.SECONDARY}
            label="Need to delete this opportunity?"
            id="opportunity_delete_toggle"
            fontSize={FONT_SIZE.SIZE_14}
          >
            <StyledSpan>
              To delete this opportunity, email{' '}
              <Link>capitalinvestment@trade.gov.uk</Link>
            </StyledSpan>
          </StyledToggle>
        </>
      )}
    </Task.Status>
  )
}

Opportunities.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}
export default connect(state2props)(Opportunities)
