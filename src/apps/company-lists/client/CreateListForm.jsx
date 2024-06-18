import React from 'react'
import PropTypes from 'prop-types'

import { FieldInput, FormLayout } from '../../../client/components'
import Form from '../../../client/components/Form'
import { FORM_LAYOUT } from '../../../common/constants'

const CreateListForm = ({
  id,
  name,
  hint = '',
  label,
  cancelUrl,
  maxLength,
  csrfToken,
}) => (
  <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
    <Form
      id="create-list-form"
      submissionTaskName="Create list"
      analyticsFormName="create-list-form"
      redirectTo={() => cancelUrl}
      flashMessage={() => 'Company list created'}
      submitButtonLabel="Create list"
      cancelRedirectTo={() => cancelUrl}
      cancelButtonLabel="Back"
      transformPayload={(values) => ({
        id,
        values,
        csrfToken,
      })}
    >
      {() => (
        <FieldInput
          name={name}
          type="text"
          label={label}
          required="Enter a name for your list"
          hint={hint}
          validate={(value) =>
            value && value.length > maxLength
              ? `Enter list name which is no longer than ${maxLength} characters long`
              : null
          }
        />
      )}
    </Form>
  </FormLayout>
)

CreateListForm.propTypes = {
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  cancelUrl: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
}

export default CreateListForm
