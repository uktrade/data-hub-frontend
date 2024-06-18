import React from 'react'
import PropTypes from 'prop-types'

import { FieldInput, LocalHeader, Main } from '../../../client/components'
import Form from '../../../client/components/Form'

import urls from '../../../lib/urls'

const EditCompanyList = ({ cancelUrl, listName, csrfToken, id, returnUrl }) => (
  <>
    <LocalHeader
      heading="Edit list name"
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          text: 'Edit list',
        },
      ]}
    />
    <Main>
      <Form
        id="edit-company-list"
        analyticsFormName="editCompanyList"
        submissionTaskName="Edit company list"
        flashMessage={() => 'List updated'}
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
    </Main>
  </>
)

EditCompanyList.propTypes = {
  listName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  cancelUrl: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default EditCompanyList
