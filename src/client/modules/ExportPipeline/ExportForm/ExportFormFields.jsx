import React from 'react'

import Form from '../../../components/Form'
import { FormLayout } from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'
import urls from '../../../../lib/urls'
import { TASK_SAVE_EXPORT } from './state'

const ExportFormFields = ({ companyId, analyticsFormName }) => (
  <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
    <Form
      id="export-form"
      analyticsFormName={analyticsFormName}
      cancelRedirectTo={() => urls.companies.activity.index(companyId)}
      submissionTaskName={TASK_SAVE_EXPORT}
    />
  </FormLayout>
)

export default ExportFormFields
