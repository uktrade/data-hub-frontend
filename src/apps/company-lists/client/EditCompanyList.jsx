import React, { useState } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { Form, FieldInput, FormActions } from 'data-hub-components'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import ErrorSummary from '@govuk-react/error-summary'

const notFoundMessage = 'The list you are trying to edit was not found. It may have already been deleted.'

function EditCompanyList ({
  label,
  hint,
  name,
  maxLength,
  cancelUrl,
  listName,
  csrfToken,
  id,
  returnUrl,
}) {
  const [errorMessage, setErrorMessage] = useState(null)
  const onSubmitHandler = async ({ listName }) => {
    try {
      await axios({
        method: 'PATCH',
        url: `/company-lists/${id}/rename?_csrf=${csrfToken}`,
        data: { name: listName, id },
      })
      return returnUrl
    } catch (error) {
      if (get(error, 'response.status') === 404) {
        setErrorMessage(notFoundMessage)
      } else {
        setErrorMessage(error.message || error.toString())
      }
    }
  }
  return (
    <>
      {errorMessage && (
        <ErrorSummary
          heading="There was an error editing this list"
          description={errorMessage}
          errors={[]}
        />
      )}
      <Form onSubmit={onSubmitHandler} initialValues={{ listName }}>
        <FieldInput
          name={name}
          type="text"
          label={label}
          required="Enter a name for your list"
          hint={hint}
          validate={value =>
            value && value.length > maxLength
              ? `Enter list name which is no longer than 30 characters`
              : null
          }
        />
        <FormActions>
          <Button>Save</Button>
          <Link href={cancelUrl}>Cancel</Link>
        </FormActions>
      </Form>
    </>
  )
}

EditCompanyList.propTypes = {
  name: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  hint: PropTypes.string,
  cancelUrl: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
}

EditCompanyList.defaultProps = {
  hint: '',
}

export default EditCompanyList
