import React from 'react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { OPTION_YES, OPTIONS_YES_NO } from '../../../../common/constants'
import { MID_GREY } from '../../../../client/utils/colours'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'
import {
  TeamTypeResource,
  HQTeamRegionOrPostsResource,
} from '../../../components/Resource'
import {
  Step,
  FieldRadios,
  FieldTypeahead,
  FieldAddAnother,
  FieldAdvisersTypeahead,
} from '../../../components'

const Container = styled('div')({
  borderLeft: `3px solid ${MID_GREY}`,
  marginLeft: 18,
  paddingLeft: 34,
})

const StyledFieldRadios = styled(FieldRadios)({
  marginBottom: 0,
})

const CreditForThisWinStep = () => {
  const { values } = useFormContext()

  // Determine the child group count by selecting any field
  const officerCount = Object.keys(values).filter((key) =>
    key.startsWith('contributing_officer')
  ).length

  return (
    <Step name={steps.CREDIT_FOR_THIS_WIN}>
      <H3 data-test="step-heading">Credit for this win</H3>
      <StyledHintParagraph data-test="hint">
        Other teams that helped with this win should be added so they can be
        credited, this will not reduce your credit for this win.
      </StyledHintParagraph>
      <StyledFieldRadios
        name="credit_for_win"
        label="Did any other teams help with this win?"
        inline={true}
        options={OPTIONS_YES_NO}
        required="Select Yes or No"
      />
      {values.credit_for_win === OPTION_YES && (
        <Container>
          <FieldAddAnother
            name="addAnother"
            label="Contributing advisers"
            hint="Up to 5 advisers can be added."
            itemName="contributing-adviser"
            buttonText="Add another"
            limitChildGroupCount={5}
            dataTestPrefix="contributing-advisers-"
            initialChildGroupCount={officerCount || 1}
          >
            {({ groupIndex }) => (
              <>
                <FieldAdvisersTypeahead
                  name={`contributing_officer_${groupIndex}`}
                  label="Contributing officer"
                  required="Enter a contributing officer"
                />
                <ResourceOptionsField
                  name={`team_type_${groupIndex}`}
                  id={`contributors-${groupIndex}`}
                  resource={TeamTypeResource}
                  field={FieldTypeahead}
                  fullWidth={true}
                  label="Team type"
                  required="Enter a team type"
                />
                {values[`team_type_${groupIndex}`] && (
                  // Should a user choose a team type, then choose a HQ team, region or post
                  // then change their mind and change the team type for a second time we
                  // want the component below to rerender and display 'Start typing'. We don't
                  // want the previous selection displayed after they've changed the team type.
                  // To ensure this happens we've added a key prop and set it to the team type
                  // id, when the id changes the component updates.
                  <ResourceOptionsField
                    key={values[`team_type_${groupIndex}`].value}
                    name={`hq_team_${groupIndex}`}
                    id={`contributors-${groupIndex}`}
                    resource={HQTeamRegionOrPostsResource}
                    field={FieldTypeahead}
                    fullWidth={true}
                    label="HQ team, region or post"
                    required="Enter a HQ team, region or post"
                    payload={{
                      team_type: values[`team_type_${groupIndex}`].value,
                    }}
                  />
                )}
              </>
            )}
          </FieldAddAnother>
        </Container>
      )}
    </Step>
  )
}

export default CreditForThisWinStep
