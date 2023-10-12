import React from 'react'
import Link from '@govuk-react/link'
import Button from '@govuk-react/button'
import { connect } from 'react-redux'

import { Form, FormLayout } from '../../../components'

import urls from '../../../../lib/urls'
import { TASK_ARCHIVE_TASK, state2props } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import { GREY_3, TEXT_COLOUR } from '../../../utils/colours'

const TaskButtons = ({ task, editUrl }) => (
  <>
    {!task.archived && (
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
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
      </FormLayout>
    )}
    <Button
      buttonColour={GREY_3}
      buttonTextColour={TEXT_COLOUR}
      as={Link}
      href={editUrl}
    >
      Edit
    </Button>
  </>
)

export default connect(state2props)(TaskButtons)
