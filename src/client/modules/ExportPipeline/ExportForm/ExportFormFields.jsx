import React from 'react'

import Form from '../../../components/Form'
import { FormLayout } from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'

const ExportFormFields = () => {
  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <Form id="export-form" />
    </FormLayout>
  )
}

export default ExportFormFields
