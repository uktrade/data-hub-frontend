import React from 'react'
import { H3 } from '@govuk-react/heading'
import Paragraph from '@govuk-react/paragraph'
import styled from 'styled-components'

import { DARK_GREY, MID_GREY } from '../../../../client/utils/colours'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { OPTION_YES, OPTIONS_YES_NO } from '../../../../common/constants'
import {
  TeamTypeResource,
  HQTeamRegionOrPostsResource,
} from '../../../components/Resource'
import {
  Step,
  FieldSelect,
  FieldRadios,
  FieldAddAnother,
  FieldAdvisersTypeahead,
} from '../../../components'
import { steps } from './constants'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()

const StyledParagraph = styled(Paragraph)({
  color: DARK_GREY,
})

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
      <H3>Credit for this win</H3>
      <StyledParagraph>
        Other teams that helped with this win should be added so they can be
        credited, this will not reduce your credit for this win.
      </StyledParagraph>
      <StyledFieldRadios
        name="credit_for_this_win"
        showBorder={true}
        label="Did any other teams help with this win?"
        options={OPTIONS_NO_YES}
      />
      {values.credit_for_this_win === OPTION_YES && (
        <Container>
          <FieldAddAnother
            name="addAnother"
            label="Contributing teams and advisers"
            hint="Up to 5 teams and advisers can be added."
            itemName="reminder"
            buttonText="Add another"
            limitChildGroupCount={5}
            initialChildGroupCount={officerCount || 1}
          >
            {({ groupIndex }) => (
              <>
                <FieldAdvisersTypeahead
                  name={`contributing_officer_${groupIndex}`}
                  label="Contributing officer"
                  required="Enter a contributing officer"
                  initialValue={values[`contributing_officer_${groupIndex}`]}
                />
                <ResourceOptionsField
                  id={`contributors-${groupIndex}`}
                  name={`team_type_${groupIndex}`}
                  emptyOption="Please choose"
                  resource={TeamTypeResource}
                  field={FieldSelect}
                  fullWidth={true}
                  label="Team type"
                  required="Enter a team type"
                  initialValue={values[`team_type_${groupIndex}`]}
                />
                {values[`team_type_${groupIndex}`] && (
                  <ResourceOptionsField
                    id={`contributors-${groupIndex}`}
                    name={`hq_team_region_or_post_${groupIndex}`}
                    emptyOption="Please choose"
                    resource={HQTeamRegionOrPostsResource}
                    field={FieldSelect}
                    fullWidth={true}
                    payload={{
                      team_type: values[`team_type_${groupIndex}`],
                    }}
                    label="HQ team, Region or Post"
                    required="Enter a HQ team, Region or Post"
                    initialValue={
                      values[`hq_team_region_or_post_${groupIndex}`]
                    }
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
