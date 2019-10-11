/* eslint-disable camelcase */
import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import {
  Form,
  FieldSelect,
  FormActions,
  StatusMessage
} from 'data-hub-components'

const onSubmit = (url, csrfToken) => {
  return async ({ sector }) => {
    await axios.post(`${url}/sector?_csrf=${csrfToken}`, { sector })
    return url
  }
}

function BusinesDetailsSectorEdit ({ companyId, csrfToken, sectors }) {
  const url = `/companies/${companyId}/business-details`

  return (
    <Form onSubmit={onSubmit(url, csrfToken)}>
      {form => (
        <div>
          {form.submissionError && (
            <StatusMessage>There was a problem when submitting the form, try again later.</StatusMessage>
          )}

          <FieldSelect
            name="sector"
            label="DIT sector"
            emptyOption="-- Select DIT sector --"
            options={sectors}
            required="Select DIT sector"
          />
          <FormActions>
            <Button>Save and return</Button>
            <Link href={url}>Return without saving</Link>
          </FormActions>
        </div>
      )}
    </Form>
  )
}

BusinesDetailsSectorEdit.propTypes = {
  companyId: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  sectors: PropTypes.array.isRequired,
}

export default BusinesDetailsSectorEdit
