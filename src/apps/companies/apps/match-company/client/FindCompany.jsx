import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'

import urls from '../../../../../lib/urls'
import { EntityListItem, FieldDnbCompany, Form } from 'data-hub-components'

function FindCompany({ company, csrfToken }) {
  return (
    <Form>
      <H3>Find the company record in the Dun & Bradstreet database</H3>
      <FieldDnbCompany
        apiEndpoint={`${urls.companies.match.index(
          company.id
        )}?_csrf=${csrfToken}`}
        queryParams={{ address_country: company.countryCode }}
        name="dnbCompany"
        entityRenderer={(props) => (
          <EntityListItem
            onEntityClick={({ dnb_company }) =>
              window.location.assign(
                urls.companies.match.confirmation(
                  company.id,
                  dnb_company.duns_number
                )
              )
            }
            {...props}
          />
        )}
        onCannotFind={() => {
          window.location.assign(urls.companies.match.cannotFind(company.id))
        }}
      />
    </Form>
  )
}

FindCompany.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  company: PropTypes.shape({
    id: PropTypes.string.isRequired,
    countryCode: PropTypes.string.isRequired,
  }),
}

export default FindCompany
