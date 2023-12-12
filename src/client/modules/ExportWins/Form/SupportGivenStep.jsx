import React from 'react'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { OPTION_YES } from '../../../../common/constants'
import { idNameToValueLabel } from '../../../utils'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'
import {
  HvcResource,
  SupportTypeResource,
  AssociatedProgrammeResource,
} from '../../../components/Resource'
import {
  Step,
  FieldTypeahead,
  FieldAddAnother,
  FieldCheckboxes,
} from '../../../components'

const SupportGivenStep = () => (
  <Step name={steps.SUPPORT_PROVIDED}>
    <H3>Support given</H3>
    <StyledHintParagraph>
      Did any of these help the customer achieve this win?
    </StyledHintParagraph>
    <ResourceOptionsField
      id="hvc"
      name="hvc"
      label="High Value Campaign (HVC) code (optional)"
      hint="If the win was linked to a HVC, select the appropriate campaign."
      required="Choose a HCVC or campaign"
      resource={HvcResource}
      resultToOptions={(results) => results.map(idNameToValueLabel)}
      field={FieldTypeahead}
    />
    <FieldAddAnother
      name="support"
      label="What type of support was given?"
      hint="You can add up to 5 types of support."
      itemName="support"
      buttonText="Add a support type"
      limitChildGroupCount={5}
    >
      {({ groupIndex }) => (
        <ResourceOptionsField
          id={`support_type_${groupIndex}`}
          name={`support_type_${groupIndex}`}
          field={FieldTypeahead}
          resource={SupportTypeResource}
          resultToOptions={(results) => results.map(idNameToValueLabel)}
          fullWidth={true}
          required="Choose a support type"
        />
      )}
    </FieldAddAnother>
    <FieldAddAnother
      name="campaign"
      label="What there as DBT campaign or event that contributed to this win?"
      hint="You can add up to 5 campaigns or events."
      itemName="campaign"
      buttonText="Add DBT campaign"
      limitChildGroupCount={5}
    >
      {({ groupIndex }) => (
        <ResourceOptionsField
          id={`campaign_${groupIndex}`}
          name={`campaign_${groupIndex}`}
          field={FieldTypeahead}
          resource={AssociatedProgrammeResource}
          resultToOptions={(results) => results.map(idNameToValueLabel)}
          fullWidth={true}
          required="Choose a DBT campaign"
        />
      )}
    </FieldAddAnother>
    <FieldCheckboxes
      name="is_personally_confirmed"
      required="Confirm that this information is complete and accurate"
      options={[
        {
          value: OPTION_YES,
          label: 'I confirm that this information is complete and accurate',
        },
      ]}
    />
    <FieldCheckboxes
      name="is_line_manager_confirmed"
      required="Confirm your line manager has agreed that this win should be recorded"
      options={[
        {
          value: OPTION_YES,
          label: 'My line manager has agreed that this win should be recorded',
        },
      ]}
    />
  </Step>
)

export default SupportGivenStep
