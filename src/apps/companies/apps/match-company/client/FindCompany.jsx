import React from 'react'
import PropTypes from 'prop-types'
import { H4 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'

import urls from '../../../../../lib/urls'
import {
  SummaryList,
  FieldDnbCompany,
  Step,
} from '../../../../../client/components'
import Form from '../../../../../client/components/Form'

function FindCompany({ company, csrfToken }) {
  return (
    <Form
      id="find-company"
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

      <Step name="companySearch" forwardButton={null} backButton={null}>
        <H4 as="h2">Search third party supplier for business details</H4>

        <FieldDnbCompany
          allResultsSelectable={true}
          apiEndpoint={`${urls.companies.match.index(
            company.id
          )}?_csrf=${csrfToken}`}
          queryParams={{ address_country: company.countryCode }}
          name="dnbCompany"
          onCompanySelect={(dnb_company) =>
            window.location.assign(
              urls.companies.match.confirmation(
                company.id,
                dnb_company.duns_number
              )
            )
          }
          onCannotFind={(e) => {
            e.preventDefault()
            window.location.assign(urls.companies.match.cannotFind(company.id))
          }}
          searchResultsMessage="Choose the business details that best match this
         company. You'll be given a chance to review the new business details
          before you verify."
        />
      </Step>
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
