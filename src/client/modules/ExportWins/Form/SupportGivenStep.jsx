import React from 'react'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { Step, FieldTypeahead, FieldCheckboxes } from '../../../components'
import { OPTION_YES } from '../../../../common/constants'
import { idNameToValueLabel } from '../../../utils'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'
import {
  HvcResource,
  SupportTypeResource,
  AssociatedProgrammeResource,
} from '../../../components/Resource'

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
    <ResourceOptionsField
      id="support_type"
      name="support_type"
      label="What type of support was given?"
      hint="You can add up to 5 types of support."
      field={FieldTypeahead}
      resource={SupportTypeResource}
      resultToOptions={(results) => results.map(idNameToValueLabel)}
      fullWidth={true}
      isMulti={true}
      validate={(value) =>
        value.length === 0
          ? 'Choose a support type'
          : value.length > 5
          ? 'Choose a maximum of 5 types of support'
          : null
      }
    />
    <ResourceOptionsField
      id="campaign"
      name="campaign"
      label="What there as DBT campaign or event that contributed to this win?"
      hint="You can add up to 5 campaigns or events."
      field={FieldTypeahead}
      resource={AssociatedProgrammeResource}
      resultToOptions={(results) => results.map(idNameToValueLabel)}
      fullWidth={true}
      isMulti={true}
      validate={(value) =>
        value.length === 0
          ? 'Choose a DBT campaign or event'
          : value.length > 5
          ? 'Choose a maximum of 5 DBT campaigns or events'
          : null
      }
    />
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
