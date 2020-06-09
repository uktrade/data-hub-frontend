import React, { useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { InsetText, H4, Button, Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { FieldRadios, FormActions } from 'data-hub-components'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader.jsx'
import Form from '../../../../../client/components/Form'
import Task from '../../../../../client/components/Task'
import { Main } from '../../../../../client/components/'
import { ID as STATE_ID, TASK_UPDATE_STAGE, state2props } from './state'
import { INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE } from '../../../../../client/actions'
import urls from '../../../../../lib/urls'
import { addMessage } from '../../../../../client/utils/flash-messages'

const StyledP = styled('p')`
  margin-bottom: ${SPACING.SCALE_2};
`

const InvestmentProjectAdmin = ({
  projectId,
  projectName,
  projectStage,
  stages,
  stageUpdated,
}) => {
  useEffect(() => {
    if (stageUpdated) {
      addMessage('success', 'Project stage saved')
      window.location.href = urls.investments.projects.project(projectId)
    }
  }, [stageUpdated])
  const newStageOptions = stages.filter(
    (stage) => stage.value != projectStage.id
  )
  return (
    <Task>
      {(getTask) => {
        const updateStageTask = getTask(TASK_UPDATE_STAGE, STATE_ID)

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
              <Form
                id={STATE_ID}
                onSubmit={(values) => {
                  updateStageTask.start({
                    payload: { values, projectId },
                    onSuccessDispatch: INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE,
                  })
                }}
                submissionError={updateStageTask.errorMessage}
              >
                <H4 as="h2">Change the stage to</H4>
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
      }}
    </Task>
  )
}

export default connect(state2props)(InvestmentProjectAdmin)
