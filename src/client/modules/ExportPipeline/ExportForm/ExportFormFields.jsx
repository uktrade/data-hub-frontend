import React from 'react'

import Form from '../../../components/Form'
import { FormLayout } from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'
import urls from '../../../../lib/urls'
import { TASK_SAVE_EXPORT } from './state'
import Task from '../../../components/Task'

const ExportFormFields = ({
  companyId,
  exportItem,
  analyticsFormName,
  taskProps = {},
}) => (
  <Task.Status {...taskProps}>
    {() => (
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
          id="export-form"
          analyticsFormName={analyticsFormName}
          cancelRedirectTo={() =>
            urls.companies.activity.index(
              exportItem ? exportItem.company.id : companyId
            )
          }
          submissionTaskName={TASK_SAVE_EXPORT}
          initialValues={exportItem}
        />
      </FormLayout>
    )}
  </Task.Status>
)

export default ExportFormFields
