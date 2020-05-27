import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { FieldRadios, FormActions, FieldInput } from 'data-hub-components'
import Form from '../../../client/components/Form'
import { ID as STATE_ID } from './state'
import { STATUS_VALUES } from './constants'

const options = STATUS_VALUES.map(({ value, label }) => ({
  value,
  label,
}))

function PipelineForm({
  onSubmit,
  submissionError,
  cancelLink,
  initialValue = {},
}) {
  return (
    <Form id={STATE_ID} onSubmit={onSubmit} submissionError={submissionError}>
      <FieldInput
        name="name"
        label="Project name"
        type="text"
        required="Enter a Project name"
        initialValue={initialValue.name}
      />
      <FieldRadios
        name="category"
        label="Choose a status"
        required="Choose a status"
        options={options}
        initialValue={initialValue.category}
      />
      <FormActions>
        <Button>{Object.keys(initialValue).length ? 'Update' : 'Add'}</Button>
        <Link href={cancelLink}>Cancel</Link>
      </FormActions>
    </Form>
  )
}

PipelineForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submissionError: PropTypes.string,
  cancelLink: PropTypes.string.isRequired,
  initialValue: PropTypes.objectOf(PropTypes.string),
}

export default PipelineForm
