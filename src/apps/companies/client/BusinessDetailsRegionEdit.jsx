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
  return async ({ uk_region }) => {
    await axios.post(`${url}/region?_csrf=${csrfToken}`, { uk_region })
    return url
  }
}

function BusinesDetailsRegionEdit ({ companyId, csrfToken, ukRegions }) {
  const url = `/companies/${companyId}/business-details`

  return (
    <Form onSubmit={onSubmit(url, csrfToken)}>
      {form => (
        <div>
          {form.submissionError && (
            <StatusMessage>There was a problem when submitting the form, try again later.</StatusMessage>
          )}

          <FieldSelect
            name="uk_region"
            label="DIT region"
            emptyOption="-- Select DIT region --"
            options={ukRegions}
            required="Select DIT region"
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

BusinesDetailsRegionEdit.propTypes = {
  companyId: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  ukRegions: PropTypes.array.isRequired,
}

export default BusinesDetailsRegionEdit
