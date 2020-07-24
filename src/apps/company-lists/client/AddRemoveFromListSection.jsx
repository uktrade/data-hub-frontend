import React, { useState } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import { AddRemoveFromListForm } from '../../../client/components/'
import ErrorSummary from '@govuk-react/error-summary'
import PropTypes from 'prop-types'

const AddRemoveFromListSection = ({
  list,
  companyId,
  token,
  createNewListUrl,
  cancelLinkUrl,
}) => {
  const [errorMessage, setErrorMessage] = useState(null)
  async function onSubmit(list) {
    try {
      await addRemoveFromList(token, companyId, list, cancelLinkUrl)
      return cancelLinkUrl
    } catch (error) {
      if (get(error, 'response.status') === 404) {
        setErrorMessage('Request failed with status code 404')
      } else {
        setErrorMessage(error.message || error.toString())
      }
    }
  }

  async function addRemoveFromList(token, companyId, list) {
    await axios({
      method: 'POST',
      url: `/companies/${companyId}/lists/add-remove?_csrf=${token}`,
      data: {
        list,
      },
    })
  }

  return (
    <>
      {errorMessage && (
        <ErrorSummary
          heading="There was an error adding or removing from lists. Please try again."
          description={errorMessage}
          errors={[]}
        />
      )}
      <AddRemoveFromListForm
        list={list}
        companyId={companyId}
        onSubmitHandler={onSubmit}
        createNewListUrl={createNewListUrl}
        cancelLinkUrl={cancelLinkUrl}
      />
    </>
  )
}

AddRemoveFromListSection.propTypes = {
  list: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  createNewListUrl: PropTypes.string.isRequired,
  cancelLinkUrl: PropTypes.string.isRequired,
}

export default AddRemoveFromListSection
