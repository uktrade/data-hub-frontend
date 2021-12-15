import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { InsetText, H4 } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader.jsx'
import Task from '../../../../../client/components/Task'
import { Main, FieldRadios } from '../../../../../client/components'
import { ID as STATE_ID, TASK_UPDATE_STAGE, state2props } from './state'
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
    <Task>
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
            actionLinks={[
              {
                children: 'Save',
                href: urls.investments.projects.project(projectId),
              },
            ]}
            analyticsFormName="investment-project-admin"
            flashMessage={() => 'Project stage saved'}
            id={STATE_ID}
            redirectTo={() => urls.investments.projects.project(projectId)}
            submissionTaskName={TASK_UPDATE_STAGE}
            transformPayload={(values) => ({ ...values, projectId })}
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
    </Task>
  )
}

export default connect(state2props)(InvestmentProjectAdmin)
