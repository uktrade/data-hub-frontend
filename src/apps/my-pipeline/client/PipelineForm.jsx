import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import {
  FieldRadios,
  FormActions,
  FieldInput,
  FieldTypeahead,
  FieldDate,
} from 'data-hub-components'
import Form from '../../../client/components/Form'
import { ID as STATE_ID } from './state'
import { STATUS_VALUES, LIKELIHOOD_VALUES } from './constants'

const statusOptions = STATUS_VALUES.map(({ value, label }) => ({
  value,
  label,
}))

const likelihoodOptions = Object.values(LIKELIHOOD_VALUES)

const IS_NUMBER = /^[0-9]*$/
function PipelineForm({
  onSubmit,
  submissionError,
  cancelLink,
  initialValue = {},
  sectors,
  contacts = [],
}) {
  return (
    <Form id={STATE_ID} onSubmit={onSubmit} submissionError={submissionError}>
      <FieldInput
        label="Project name"
        name="name"
        type="text"
        required="Enter a Project name"
        initialValue={initialValue.name}
        className="govuk-!-width-two-thirds"
      />
      <FieldRadios
        label="Choose a status"
        name="category"
        required="Choose a status"
        options={statusOptions}
        initialValue={initialValue.category}
      />
      <FieldRadios
        label="Likelihood to export (optional)"
        name="likelihood"
        options={likelihoodOptions.map(({ value, label }) => ({
          label,
          value: String(value),
        }))}
        initialValue={initialValue.likelihood}
      />
      <FieldTypeahead
        label="Export sector (optional)"
        name="sector"
        options={sectors}
        initialValue={initialValue.sector}
        placeholder="Search sectors..."
        isClearable={true}
        className="govuk-!-width-two-thirds"
      />
      <FieldTypeahead
        label="Company contact (optional)"
        name="contact"
        options={contacts.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        initialValue={initialValue.contact}
        noOptionsMessage={() => 'This company has no contacts'}
        placeholder="Select a contact..."
        isClearable={true}
        className="govuk-!-width-two-thirds"
      />
      <FieldInput
        label="Potential export value (optional)"
        hint="Amount in GBP"
        name="export_value"
        type="text"
        initialValue={initialValue.export_value}
        pattern="[0-9]*"
        inputmode="numeric"
        spellcheck="false"
        className="govuk-input--width-10"
        validate={(value) =>
          !value || IS_NUMBER.test(value)
            ? null
            : 'Potential export value must be a number'
        }
      />
      <FieldDate
        format="short"
        label="Expected date for win (optional)"
        hint="For example 11 2020"
        name="expected_win_date"
        initialValue={initialValue.expected_win_date}
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
  initialValue: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  sectors: PropTypes.array.isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
}

export default PipelineForm
