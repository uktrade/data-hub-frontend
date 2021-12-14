/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { FieldInput } from '../../../client/components'
import TaskForm from '../../../client/components/Task/Form'

const CreateListForm = (
  {
    id,
    name,
    hint,
    label,
    cancelUrl,
    maxLength,
    csrfToken,
  }) => {

  return (
    <TaskForm
      id="create-list-form"
      submissionTaskName="Create list"
      analyticsFormName="create-list-form"
      redirectTo={() => cancelUrl}
      flashMessage={() => "Company list created"}
      submitButtonLabel="Create list"
      actionLinks={[
        {
          href: cancelUrl,
          children: 'Cancel',
        },
      ]}
      transformPayload={(values) => ({
        id,
        values,
        cancelUrl,
        csrfToken
      })}
    >
      {() => {
        return (
          <FieldInput
            name={name}
            type="text"
            label={label}
            required="Enter a name for your list"
            hint={hint}
            validate={(value) =>
              value && value.length > maxLength
                ? `Enter list name which is no longer than ${maxLength} characters`
                : null
            }
          />
        )
      }}
    </TaskForm>
  )
}

CreateListForm.propTypes = {
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  cancelUrl: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
}

CreateListForm.defaultProps = {
  hint: '',
}

export default CreateListForm
