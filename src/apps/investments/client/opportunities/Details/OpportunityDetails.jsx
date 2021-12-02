import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import pluralize from 'pluralize'

import { state2props } from './state'
import {
  INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
  INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
} from '../../../../../client/actions'

import OpportunityDetailsTable from './OpportunityDetailsTable'
import OpportunityRequirementsTable from './OpportunityRequirementsTable'
import OpportunityDetailsForm from './OpportunityDetailsForm'
import OpportunityRequirementsForm from './OpportunityRequirementsForm'

import { SummaryTable, ToggleSection } from '../../../../../client/components'
import { FONT_SIZE } from '@govuk-react/constants'

import styled from 'styled-components'
import { RED } from 'govuk-colours'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { Details, SectionBreak } from 'govuk-react'

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 19px;
  margin: 10px 5px 5px;
  color: ${RED};
`

const StyledDetails = styled(Details)`
  margin-bottom: 0;
  span {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

const IncompleteFieldsBadge = (incompleteFieldCount) => {
  const badgeText =
    incompleteFieldCount == 0
      ? 'Complete'
      : `${pluralize('field', incompleteFieldCount, true)} incomplete`

  return <StyledLabel>{badgeText}</StyledLabel>
}

const OpportunitySection = ({
  incompleteFields,
  toggleName,
  id,
  children,
  form,
  isEditing,
  onEdit,
}) => (
  <>
    <ToggleSection
      label={toggleName}
      id={`${id}_toggle`}
      badge={IncompleteFieldsBadge(incompleteFields)}
      justifyHeaderContent={true}
    >
      {isEditing ? (
        <>{form}</>
      ) : (
        <>
          <SummaryTable>{children}</SummaryTable>
          <Button onClick={onEdit} data-test={`${id}_button`}>
            Edit
          </Button>
        </>
      )}
    </ToggleSection>
    <SectionBreak />
  </>
)

const OpportunityDetails = ({
  opportunity,
  opportunityId,
  onDetailsEdit,
  onRequirementsEdit,
}) => {
  const {
    detailsFields,
    requirementsFields,
    incompleteDetailsFields,
    incompleteRequirementsFields,
    isEditingDetails,
    isEditingRequirements,
  } = opportunity
  return (
    <>
      <OpportunitySection
        incompleteFields={incompleteDetailsFields}
        form={<OpportunityDetailsForm opportunityId={opportunityId} />}
        toggleName="Opportunity details"
        id="opportunity_details"
        isEditing={isEditingDetails}
        onEdit={onDetailsEdit}
      >
        <OpportunityDetailsTable details={detailsFields} />
      </OpportunitySection>
      <OpportunitySection
        incompleteFields={incompleteRequirementsFields}
        form={<OpportunityRequirementsForm opportunityId={opportunityId} />}
        toggleName="Opportunity requirements"
        id="opportunity_requirements"
        isEditing={isEditingRequirements}
        onEdit={onRequirementsEdit}
      >
        <OpportunityRequirementsTable details={requirementsFields} />
      </OpportunitySection>
      <StyledDetails summary="Need to delete this opportunity?">
        To delete this opportunity, email{' '}
        <Link>capitalinvestment@trade.gov.uk</Link>
      </StyledDetails>
    </>
  )
}
OpportunityDetails.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}
export default connect(state2props, (dispatch) => ({
  onDetailsEdit: () => {
    dispatch({
      type: INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
    })
  },
  onRequirementsEdit: () => {
    dispatch({
      type: INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
    })
  },
}))(OpportunityDetails)
