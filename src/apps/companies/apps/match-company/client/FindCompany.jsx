import React from 'react'
import PropTypes from 'prop-types'
import { H4 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'

import urls from '../../../../../lib/urls'
import {
  EntityListItem,
  FieldDnbCompany,
  Form,
  SummaryList,
} from 'data-hub-components'

function FindCompany({ company, csrfToken }) {
  return (
    <Form
      initialValues={{
        dnbCompanyName: company.name,
        dnbPostalCode: company.postcode,
      }}
    >
      <H4 as="h2">Existing Data Hub company record</H4>
      <InsetText>
        <SummaryList
          rows={[
            { label: 'Company name', value: company.name },
            { label: 'Located at', value: company.address.join(', ') },
          ]}
        />
      </InsetText>

      <H4 as="h2">Find the verified third party company record</H4>
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
    name: PropTypes.string.isRequired,
    address: PropTypes.arrayOf(PropTypes.string),
    postcode: PropTypes.string.isRequired,
    countryCode: PropTypes.string.isRequired,
  }),
}

export default FindCompany
