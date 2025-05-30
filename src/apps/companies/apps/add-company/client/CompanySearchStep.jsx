import React from 'react'
import { flushSync } from 'react-dom'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'

import { useFormContext } from '../../../../../client/components/Form/hooks'
import { FieldDnbCompany, Step } from '../../../../../client/components'
import AccessibleLink from '../../../../../client/components/Link'

export const getDnbEntityText = (companyId, isOutOfBusiness, companyName) => {
  if (isOutOfBusiness) {
    return (
      <span data-test="company-out-of-business">
        This company has stopped trading and is no longer in business.
      </span>
    )
  }

  if (companyId) {
    return (
      <div data-test="company-already-on-datahub">
        This company is already on Data Hub. You can record activity{' '}
        <AccessibleLink
          href={`/companies/${companyId}`}
          aria-label={`Go to ${companyName} details page to record activity`}
        >
          on the company page.
        </AccessibleLink>
      </div>
    )
  }

  return null
}

function CompanySearchStep({ countryName, countryIsoCode, csrfToken }) {
  const { setFieldValue, goForward } = useFormContext()
  return (
    <Step name="companySearch" forwardButton={null} backButton={null}>
      <H3>Find the company</H3>

      <FieldDnbCompany
        allResultsSelectable={false}
        apiEndpoint={`/companies/create/dnb/company-search?_csrf=${csrfToken}`}
        queryParams={{ address_country: countryIsoCode }}
        name="dnbCompany"
        country={countryName}
        onCompanySelect={(dnb_company) => {
          setFieldValue('cannotFind', false)
          setFieldValue('dnbCompany', dnb_company)
        }}
        onCannotFind={() => {
          // The CompanyNotFoundStep where the user manually adds a company to Data Hub via
          // a form was being skipped altogether throwing out the sequencing of form steps.
          // This is due to React v18 batching state updates. Previosuly, for each individual
          // state update React v17 would re-render, now in React v18 all state updates are
          // batched followed by a single re-render, this new approach avoids unnecessary
          // re-renders and leads to better performance.
          // https://github.com/reactwg/react-18/discussions/21

          // Opt out of React v18 batching so the form functions as before.
          flushSync(() => setFieldValue('cannotFind', true))
          // Opt out of React v18 batching so the form functions as before.
          flushSync(() => goForward())
        }}
      />
    </Step>
  )
}

CompanySearchStep.propTypes = {
  countryName: PropTypes.string,
  countryIsoCode: PropTypes.string,
  csrfToken: PropTypes.string.isRequired,
}

export default CompanySearchStep
