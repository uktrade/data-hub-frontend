import axios from 'axios'
import { get } from 'lodash'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DeleteCompanyListSection } from '../../../client/components/'

const notFoundMessage =
  'The list was not found. It may have already been deleted.'

function DeleteCompanyList({ companyList, csrfToken, returnUrl }) {
  const [errorMessage, setErrorMessage] = useState(null)
  const onDelete = async () => {
    try {
      await axios.post(`/company-lists/${companyList.id}/delete`, null, {
        params: { _csrf: csrfToken },
      })
      window.location.assign('/')
    } catch (error) {
      if (get(error, 'response.status') === 404) {
        setErrorMessage(notFoundMessage)
      } else {
        setErrorMessage(error.message || error.toString())
      }
    }
  }

  return (
    <DeleteCompanyListSection
      companyList={companyList}
      returnUrl={returnUrl}
      onDelete={onDelete}
      errorMessage={errorMessage}
    />
  )
}

DeleteCompanyList.propTypes = {
  companyList: PropTypes.object.isRequired,
  csrfToken: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
}

export default DeleteCompanyList
