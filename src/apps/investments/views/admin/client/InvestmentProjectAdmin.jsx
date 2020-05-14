import React from 'react'
import styled from 'styled-components'

import { Main, InsetText, H4, Button, Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { FieldRadios, FormActions } from 'data-hub-components'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader.jsx'
import Form from '../../../../../client/components/Form'
import urls from '../../../../../lib/urls'

const StyledP = styled('p')`
  margin-bottom: ${SPACING.SCALE_2};
`

const InvestmentProjectAdmin = ({
  projectId,
  projectName,
  projectStage,
  stages,
}) => {
  const newStageOptions = stages.filter(
    (stage) => stage.value != projectStage.id
  )
  return (
    <>
      <LocalHeader
        heading={'Change the project stage'}
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.investments.index(), text: 'Investments' },
          { link: urls.investments.projects.index(), text: 'Projects' },
          {
            link: urls.investments.projects.project(projectId),
            text: projectName,
          },
          { text: 'Admin' },
        ]}
      />
      <Main>
        <H4>Project details</H4>
        <InsetText>
          <p>Project name: {projectName}</p>
          <StyledP>Current stage: {projectStage.name}</StyledP>
        </InsetText>
        <Form>
          <H4>Change the stage to</H4>
          <FieldRadios
            name="projectStageId"
            required="Select a new stage"
            options={newStageOptions}
          />
          <FormActions>
            <Button>Save</Button>
            <Link href={urls.investments.projects.project(projectId)}>
              Cancel
            </Link>
          </FormActions>
        </Form>
      </Main>
    </>
  )
}

export default InvestmentProjectAdmin
