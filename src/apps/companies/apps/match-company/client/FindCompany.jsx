import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'
import { companies } from '../../../../../lib/urls'

import { Form, FieldDnbCompany } from 'data-hub-components'

function FindCompany({ csrfToken, company }) {
  function onSubmit(values) {
    console.log(values) // Intentional
  }

  return (
    <Form onSubmit={onSubmit}>
      <H3>Find the company record in the Dun & Bradstreet database</H3>
      <FieldDnbCompany
        apiEndpoint={`${companies.match.index(company.id)}?_csrf=${csrfToken}`}
        queryParams={{ address_country: 'GB' }}
        name="dnbCompany"
      />
    </Form>
  )
}

FindCompany.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  company: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

export default FindCompany
