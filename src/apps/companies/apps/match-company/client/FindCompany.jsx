import React from 'react'
import PropTypes from 'prop-types'
import { H4 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'

import urls from '../../../../../lib/urls'
import { EntityListItem } from '../../../../../client/components/'
import { FieldDnbCompany, FormStateful, SummaryList } from 'data-hub-components'

function FindCompany({ company, csrfToken }) {
  return (
    <FormStateful
      initialValues={{
        dnbCompanyName: company.name,
        dnbPostalCode: company.postcode,
      }}
    >
      <H4 as="h2">Data Hub business details (un-verified)</H4>
      <InsetText>
        <SummaryList
          rows={[
            { label: 'Company name', value: company.name },
            { label: 'Located at', value: company.address.join(', ') },
          ]}
        />
      </InsetText>

      <H4 as="h2">Search third party supplier for business details</H4>
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
        searchResultsMessage="Choose the business details that best match this
         company. You'll be given a chance to review the new business details
          before you verify."
      />
    </FormStateful>
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
