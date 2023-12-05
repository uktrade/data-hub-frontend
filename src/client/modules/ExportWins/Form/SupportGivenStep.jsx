import React from 'react'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { useFormContext } from '../../../components/Form/hooks'
import {
  HvcResource,
  SupportTypeResource,
  AssociatedProgrammeResource,
} from '../../../components/Resource'
import { idNameToValueLabel } from '../../../utils'
import {
  Step,
  FieldTypeahead,
  FieldAddAnother,
  FieldSelect,
} from '../../../components'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'

const SupportGivenStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
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
            field={FieldSelect}
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
            field={FieldSelect}
            resource={AssociatedProgrammeResource}
            resultToOptions={(results) => results.map(idNameToValueLabel)}
            fullWidth={true}
            required="Choose a DBT campaign"
          />
        )}
      </FieldAddAnother>
    </Step>
  )
}

export default SupportGivenStep
