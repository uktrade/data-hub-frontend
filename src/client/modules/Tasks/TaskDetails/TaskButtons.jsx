import React from 'react'
import { connect } from 'react-redux'
import Link from '@govuk-react/link'
import Button from '@govuk-react/button'
import { GridRow } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import { Form } from '../../../components'
import urls from '../../../../lib/urls'
import {
  TASK_DELETE,
  TASK_SAVE_STATUS_COMPLETE,
  buttonState2props,
} from './state'
import { GREY_3, RED, TEXT_COLOUR } from '../../../utils/colours'
import { STATUS } from '../TaskForm/constants'

const ButtonWrapper = styled.div`
  min-height: 71px;
  * {
    margin-left: ${SPACING.SCALE_4};
  }
  * {
    vertical-align: baseline;
  }
`

const DeleteTaskWrapper = styled.div`
  * {
    margin-left: ${SPACING.SCALE_1};
  }
`

export const TaskButtons = ({ task, returnUrl }) => (
  <>
    <GridRow>
      {!task.archived && task.status == STATUS.ACTIVE && (
        <Form
          id="task-save-status-complete-form"
          data-test="task-save-status-complete-form"
          analyticsFormName="taskSaveStatusCompleteForm"
          redirectTo={() => urls.dashboard.myTasks()}
          cancelRedirectTo={false}
          submissionTaskName={TASK_SAVE_STATUS_COMPLETE}
          transformPayload={() => ({
            taskId: task.id,
          })}
          flashMessage={() => 'Task marked as complete'}
          submitButtonLabel="Mark as complete"
          initialValues={task}
        />
      )}
      <ButtonWrapper>
        {!task.archived && task.status == STATUS.ACTIVE && (
          <Button
            buttonColour={GREY_3}
            buttonTextColour={TEXT_COLOUR}
            as={'a'}
            href={urls.tasks.edit(task.id)}
            data-test="edit-form-button"
          >
            Edit
          </Button>
        )}
        <Button
          buttonColour={GREY_3}
          buttonTextColour={TEXT_COLOUR}
          as={'a'}
          href={urls.tasks.createCopyTask(task.id)}
          data-test="create-similar-task-button"
        >
          Create similar task
        </Button>
      </ButtonWrapper>
      {!task.archived && (
        <DeleteTaskWrapper>
          <Form
            id="task-delete-form"
            data-test="task-delete-form"
            analyticsFormName="taskDeleteForm"
            redirectTo={() => urls.dashboard.myTasks()}
            cancelRedirectTo={false}
            submissionTaskName={TASK_DELETE}
            transformPayload={() => ({
              taskId: task.id,
            })}
            submitButtonColour={RED}
            flashMessage={() => 'Task deleted'}
            submitButtonLabel="Delete task"
            initialValues={task}
          />
        </DeleteTaskWrapper>
      )}
      <ButtonWrapper>
        <Link
          data-test="task-back-link"
          href={returnUrl ?? urls.dashboard.myTasks()}
        >
          Back
        </Link>
      </ButtonWrapper>
    </GridRow>
  </>
)

export default connect(buttonState2props)(TaskButtons)
