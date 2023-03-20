import React from 'react'

import Form from '../../../components/Form'
import { FieldInput, FormLayout } from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_SAVE_EXPORT } from './state'
import Task from '../../../components/Task'
import { ERROR_MESSAGES } from './constants'

const ExportFormFields = ({
  exportItem,
  analyticsFormName,
  flashMessage,
  cancelRedirectUrl,
  redirectToUrl,
  taskProps = {},
}) => (
  <Task.Status {...taskProps}>
    {() => (
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
          id="export-form"
          analyticsFormName={analyticsFormName}
          cancelRedirectTo={() => cancelRedirectUrl}
          redirectTo={() => redirectToUrl}
          submissionTaskName={TASK_SAVE_EXPORT}
          initialValues={exportItem}
          transformPayload={(values) => ({ exportId: values.id, values })}
          flashMessage={flashMessage}
        >
          {() => (
            <FieldInput
              name="title"
              label="Export title"
              hint="It helps to give export details in the title, for example product and destination"
              type="text"
              required={ERROR_MESSAGES.title}
            />
          )}
        </Form>
      </FormLayout>
    )}
  </Task.Status>
)

export default ExportFormFields
