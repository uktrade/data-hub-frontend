import React from 'react'

import { Form, FormLayout } from '../../../components'

import urls from '../../../../lib/urls'
import { TASK_ARCHIVE_TASK } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'

const TaskButtons = ({ task }) => (
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
          transformPayload={(values) => ({
            values,
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
  </>
)

export default TaskButtons
