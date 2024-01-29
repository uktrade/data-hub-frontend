import React from 'react'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { Step, FieldTypeahead, FieldCheckboxes } from '../../../components'
import { OPTION_YES } from '../../../../common/constants'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'
import {
  HvcResource,
  SupportTypeResource,
  AssociatedProgrammeResource,
} from '../../../components/Resource'

const SupportProvidedStep = () => (
  <Step name={steps.SUPPORT_PROVIDED}>
    <H3 data-test="step-heading">Support given</H3>
    <StyledHintParagraph data-test="hint">
      Did any of these help the customer achieve this win?
    </StyledHintParagraph>
    <ResourceOptionsField
      id="hvc"
      name="hvc"
      label="High Value Campaign (HVC) code (optional)"
      hint="If the win was linked to a HVC, select the appropriate campaign."
      resource={HvcResource}
      field={FieldTypeahead}
    />
    <ResourceOptionsField
      name="type_of_support"
      id="type-of-support"
      label="What type of support was given?"
      hint="You can add up to 5 types of support."
      field={FieldTypeahead}
      resource={SupportTypeResource}
      fullWidth={true}
      isMulti={true}
      required="Select at least one type of support"
      validate={(value) =>
        value?.length > 5 && 'Select a maximum of 5 types of support'
      }
    />
    <ResourceOptionsField
      name="associated_programme"
      id="associated-programme"
      label="Was there a DBT campaign or event that contributed to this win?"
      hint="You can add up to 5 campaigns or events."
      field={FieldTypeahead}
      resource={AssociatedProgrammeResource}
      fullWidth={true}
      isMulti={true}
      required="Select at least one type of DBT campaign or event"
      validate={(value) =>
        value?.length > 5 && 'Select a maximum of 5 DBT campaigns or events'
      }
    />
    <FieldCheckboxes
      name="is_personally_confirmed"
      required="Confirm that this information is complete and accurate"
      options={[
        {
          value: OPTION_YES,
          label: 'I confirm that this information is complete and accurate.',
        },
      ]}
    />
    <FieldCheckboxes
      name="is_line_manager_confirmed"
      required="Confirm your line manager has agreed that this win should be recorded"
      options={[
        {
          value: OPTION_YES,
          label: 'My line manager has agreed that this win should be recorded.',
        },
      ]}
    />
  </Step>
)

export default SupportProvidedStep
