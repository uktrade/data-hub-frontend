import React from 'react'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import {
  FormStateful,
  FieldInput,
  FormActions,
} from '../../../client/components'

const CreateListForm = ({
  name,
  label,
  hint,
  maxLength,
  onSubmitHandler,
  cancelUrl,
}) => {
  const cancelLink = `${cancelUrl}`
  return (
    <FormStateful onSubmit={onSubmitHandler}>
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
      <FormActions>
        <Button>Create list</Button>
        <Link href={cancelLink}>Cancel</Link>
      </FormActions>
    </FormStateful>
  )
}

CreateListForm.propTypes = {
  onSubmitHandler: PropTypes.func.isRequired,
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
