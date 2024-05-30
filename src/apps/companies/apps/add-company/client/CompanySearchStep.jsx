/* eslint-disable camelcase */

import React from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { H3 } from '@govuk-react/heading'

import EntityListItem from '../../../../../client/components/EntityList/EntityListItem'
import { useFormContext } from '../../../../../client/components/Form/hooks'
import { FieldDnbCompany, Step } from '../../../../../client/components'

function DnbCompanyRenderer(props) {
  const { setFieldValue, goForward } = useFormContext()

  function onEntityClick({ dnb_company }) {
    setFieldValue('cannotFind', false)
    setFieldValue('dnbCompany', dnb_company)
    goForward()
  }

  const { data } = props
  const companyId = get(data, 'datahub_company.id')
  const isOutOfBusiness = get(data, 'dnb_company.is_out_of_business')
  const companyName = get(data, 'dnb_company.primary_name')
  const isClickable = !companyId && !isOutOfBusiness

  return (
    <EntityListItem
      onEntityClick={isClickable ? onEntityClick : null}
      text={getDnbEntityText(companyId, isOutOfBusiness, companyName)}
      {...props}
    />
  )
}

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
        <Link
          href={`/companies/${companyId}`}
          aria-label={`Go to ${companyName} details page to record activity`}
        >
          on the company page.
        </Link>
      </div>
    )
  }

  return null
}

function CompanySearchStep({
  countryName,
  countryIsoCode,
  csrfToken,
  features,
}) {
  const { setFieldValue, goForward } = useFormContext()
  return (
    <Step name="companySearch" forwardButton={null} backButton={null}>
      <H3>Find the company</H3>

      <FieldDnbCompany
        apiEndpoint={`/companies/create/dnb/company-search?_csrf=${csrfToken}`}
        queryParams={{ address_country: countryIsoCode }}
        name="dnbCompany"
        country={countryName}
        entityRenderer={DnbCompanyRenderer}
        onCannotFind={() => {
          // React v18 batching is causing issues with the sequencing of form steps.
          // https://github.com/reactwg/react-18/discussions/21

          // The CompanyNotFoundStep, where the user manually adds a company to Data Hub via
          // a form, is skipped altogether. If time permits, we should refactor the code to
          // include batch updates, as this would avoid unnecessary re-renders. However, this
          // task is beyond the scope of upgrading React to the latest version. We should
          // revisit this when we move the entire app to src/client/modules, which is necessary.
          // For now, opting out of batching allows our functional tests to pass.

          // Opt out of React v18 batching.
          flushSync(() => {
            setFieldValue('cannotFind', true)
          })

          // Opt out of React v18 batching.
          flushSync(() => {
            goForward()
          })
        }}
        features={features}
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
