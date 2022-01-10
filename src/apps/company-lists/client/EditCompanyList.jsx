import React from 'react'
import PropTypes from 'prop-types'

import { FieldInput } from '../../../client/components'

import Form from '../../../client/components/Form'

const EditCompanyList = ({ cancelUrl, listName, csrfToken, id, returnUrl }) => (
  <Form
    id="edit-company-list"
    analyticsFormName="editCompanyList"
    submissionTaskName="Edit company list"
    initialValues={{ listName }}
    cancelRedirectTo={() => cancelUrl}
    transformPayload={(values) => ({ ...values, id, csrfToken })}
    redirectTo={() => returnUrl}
  >
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
  </Form>
)

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
