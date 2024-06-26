import React from 'react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import { Step, FieldCheckboxes } from '../../../components'
import { OPTION_YES } from '../../../../common/constants'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'

import AssociatedProgramme from '../../../components/Resource/AssociatedProgramme'
import SupportType from '../../../components/Resource/SupportType'
import Hvc from '../../../components/Resource/Hvc'

const StyledFieldCheckboxes = styled(FieldCheckboxes)({
  marginBottom: 0,
})

const SupportProvidedStep = () => (
  <Step name={steps.SUPPORT_PROVIDED}>
    <H3 data-test="step-heading">Support given</H3>
    <StyledHintParagraph data-test="hint">
      Did any of these help the customer achieve this win?
    </StyledHintParagraph>
    <Hvc.FieldTypeahead
      id="hvc"
      name="hvc"
      label="High Value Campaign (HVC) code (optional)"
      hint="If the win was linked to a HVC, select the appropriate campaign."
    />
    <SupportType.FieldTypeahead
      name="type_of_support"
      id="type-of-support"
      label="What type of support was given?"
      hint="You can add up to 5 types of support."
      fullWidth={true}
      isMulti={true}
      required="Select at least one type of support"
      validate={(value) =>
        value?.length > 5 && 'Select a maximum of 5 types of support'
      }
    />
    <AssociatedProgramme.FieldTypeahead
      name="associated_programme"
      id="associated-programme"
      label="Was there a DBT campaign or event that contributed to this win?"
      hint="You can add up to 5 campaigns or events."
      fullWidth={true}
      isMulti={true}
      required="Select at least one type of DBT campaign or event"
      validate={(value) =>
        value?.length > 5 && 'Select a maximum of 5 DBT campaigns or events'
      }
    />
    <StyledFieldCheckboxes
      name="is_personally_confirmed"
      required="Confirm that this information is complete and accurate"
      boldLabel={true}
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
      boldLabel={true}
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
