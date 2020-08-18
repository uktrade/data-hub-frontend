import React, { useState } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import ErrorSummary from '@govuk-react/error-summary'

import {
  FormStateful,
  FieldInput,
  FormActions,
} from '../../../client/components'

const NOT_FOUND_MESSAGE =
  'The list you are trying to edit was not found. It may have already been deleted.'

function EditCompanyList({ cancelUrl, listName, csrfToken, id, returnUrl }) {
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
        setErrorMessage(NOT_FOUND_MESSAGE)
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
      <FormStateful onSubmit={onSubmitHandler} initialValues={{ listName }}>
        <FieldInput
          name="listName"
          type="text"
          label="List name"
          required="Enter a name for your list"
          hint="This is a name only you see, and can be up to 30 characters"
          validate={(value) =>
            value && value.length > 30
              ? `Enter list name which is no longer than 30 characters`
              : null
          }
        />
        <FormActions>
          <Button>Save</Button>
          <Link href={cancelUrl}>Cancel</Link>
        </FormActions>
      </FormStateful>
    </>
  )
}

EditCompanyList.propTypes = {
  listName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  cancelUrl: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

EditCompanyList.defaultProps = {
  hint: '',
}

export default EditCompanyList
