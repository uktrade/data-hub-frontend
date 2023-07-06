/* eslint-disable camelcase */

import React from 'react'
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
          setFieldValue('cannotFind', true)
          goForward()
        }}
        features={features}
      />
    </Step>
  )
}

CompanySearchStep.propTypes = {
  countryName: PropTypes.string.isRequired,
  countryIsoCode: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default CompanySearchStep
