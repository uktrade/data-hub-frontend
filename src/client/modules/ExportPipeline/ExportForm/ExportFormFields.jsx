import React from 'react'

import Form from '../../../components/Form'
import { FormLayout } from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'
import urls from '../../../../lib/urls'
import { TASK_SAVE_EXPORT } from './state'

const ExportFormFields = ({ companyId }) => {
  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <Form
        id="export-form"
        analyticsFormName="addExportForm"
        cancelRedirectTo={() => urls.companies.details(companyId)}
        submissionTaskName={TASK_SAVE_EXPORT}
      />
    </FormLayout>
  )
}

export default ExportFormFields
