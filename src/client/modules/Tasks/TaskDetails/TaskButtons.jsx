import React from 'react'
import Link from '@govuk-react/link'
import Button from '@govuk-react/button'
import { connect } from 'react-redux'
import { GridRow } from 'govuk-react'

import { SPACING } from '@govuk-react/constants'

import styled from 'styled-components'

import { Form } from '../../../components'

import urls from '../../../../lib/urls'
import { TASK_ARCHIVE_TASK, buttonState2props } from './state'
import { GREY_3, TEXT_COLOUR } from '../../../utils/colours'

const GreyButton = styled(Button)`
  background-color: ${GREY_3};
  color: ${TEXT_COLOUR};
  margin-left: ${SPACING.SCALE_5};
`

export const TaskButtons = ({ task, editUrl }) => (
  <>
    <GridRow>
      {!task.archived && (
        <Form
          id="archive-task-form"
          analyticsFormName="archiveTaskForm"
          redirectTo={() =>
            urls.investments.projects.tasks.index(
              task.investmentProjectTask.investmentProject.id
            )
          }
          cancelRedirectTo={false}
          submissionTaskName={TASK_ARCHIVE_TASK}
          transformPayload={() => ({
            taskId: task.id,
          })}
          flashMessage={() => 'Task marked as complete'}
          submitButtonLabel="Mark as complete"
          initialValues={task}
        >
          {() => <></>}
        </Form>
      )}

      <Button
        buttonColour={GREY_3}
        buttonTextColour={TEXT_COLOUR}
        as={Link}
        href={editUrl}
        data-test="edit-form-button"
      >
        Edit
      </Button>

      <Button
        buttonColour={GREY_3}
        buttonTextColour={TEXT_COLOUR}
        as={Link}
        href={urls.investments.projects.tasks.index(
          task.investmentProjectTask.investmentProject.id
        )}
        data-test="back-button"
      >
        Back
      </Button>

      <GreyButton
        as={Link}
        buttonColour={GREY_3}
        buttonTextColour={TEXT_COLOUR}
      >
        Messin' Button
      </GreyButton>
    </GridRow>
  </>
)

export default connect(buttonState2props)(TaskButtons)
