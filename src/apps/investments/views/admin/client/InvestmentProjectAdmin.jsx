import React from 'react'
import styled from 'styled-components'

import { InsetText, H4 } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main, FieldRadios } from '../../../../../client/components'
import { TASK_UPDATE_STAGE } from './state'
import urls from '../../../../../lib/urls'

import TaskForm from '../../../../../client/components/Task/Form'

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
        <H4 as="h2">Project details</H4>
        <InsetText>
          <p>Project name: {projectName}</p>
          <StyledP>Current stage: {projectStage.name}</StyledP>
        </InsetText>
        <TaskForm
          cancelRedirectTo={() => urls.investments.projects.project(projectId)}
          analyticsFormName="investmentProjectAdmin"
          flashMessage={() => 'Project stage saved'}
          id="investmentProjectAdmin"
          redirectTo={() => urls.investments.projects.project(projectId)}
          submissionTaskName={TASK_UPDATE_STAGE}
          transformPayload={(values) => ({ values, projectId })}
        >
          <H4 as="h2">Change the stage to</H4>
          <FieldRadios
            name="projectStageId"
            required="Select a new stage"
            options={newStageOptions}
          />
        </TaskForm>
      </Main>
    </>
  )
}

export default InvestmentProjectAdmin
