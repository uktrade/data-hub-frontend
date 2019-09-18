/**
 * Functional tests: ./test/functional/cypress/specs/companies/add-company-spec.js
 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { get } from 'lodash'
import { H3 } from '@govuk-react/heading'
import LoadingBox from '@govuk-react/loading-box'

import {
  FieldDnbCompany,
  FieldRadios,
  FieldSelect,
  Form,
  Step,
} from 'data-hub-components'

import CompanyFoundStep from './CompanyFoundStep'
import CompanyNotFoundStep from './CompanyNotFoundStep'

function AddCompanyForm ({ host, csrfToken, countries, organisationTypes, regions, sectors }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const UK_ISO_CODE = 'GB'

  const optionCountryUK = countries.find(({ value }) => value === UK_ISO_CODE)
  const overseasCountries = countries.filter(({ value }) => value && value !== UK_ISO_CODE)

  const COMPANY_LOCATION_OPTIONS = {
    uk: optionCountryUK,
    overseas: {
      label: 'Overseas',
      value: 'overseas',
      children: (
        <FieldSelect
          required="Select in which country the company is based"
          emptyOption="-- Select country --"
          label="Country"
          name="companyOverseasCountry"
          options={overseasCountries}
        />
      ),
    },
  }

  function getCountry ({ companyLocation, companyOverseasCountry }) {
    if (companyLocation && companyLocation === COMPANY_LOCATION_OPTIONS.uk.value) {
      return COMPANY_LOCATION_OPTIONS.uk
    }

    if (companyOverseasCountry) {
      return overseasCountries.find(c => c.value === companyOverseasCountry)
    }
  }

  async function onSubmit (values) {
    setIsSubmitting(true)

    const path = values.cannotFind ? 'company-investigation' : 'company-create'

    try {
      const { data } = await axios.post(`//${host}/companies/create/dnb/${path}?_csrf=${csrfToken}`, values)
      window.location.href = `//${host}/companies/${data.id}`
    } catch (error) {
      // todo handle error
    }

    setIsSubmitting(false)
  }

  return (
    <Form onSubmit={onSubmit}>
      {({ values }) => {
        const country = getCountry(values)
        const countryName = get(country, 'label')
        const countryIsoCode = get(country, 'value')

        return (
          <LoadingBox loading={isSubmitting}>
            <Step name="companyLocation">
              <H3>Where is this company based?</H3>

              <FieldRadios
                name="companyLocation"
                required="Specify location of the company"
                options={Object.values(COMPANY_LOCATION_OPTIONS)}
              />
            </Step>

            <Step name="companySearch" hideForwardButton={true} hideBackButton={true}>
              <H3>Find the company</H3>

              <FieldDnbCompany
                apiEndpoint={`//${host}/companies/create/dnb/company-search?_csrf=${csrfToken}`}
                queryParams={{ address_country: countryIsoCode }}
                name="dnbCompany"
                country={countryName}
              />
            </Step>

            {!values.cannotFind && <CompanyFoundStep />}

            {values.cannotFind && (
              <CompanyNotFoundStep
                organisationTypes={organisationTypes}
                regions={regions}
                sectors={sectors}
              />
            )}
          </LoadingBox>
        )
      }}
    </Form>
  )
}

AddCompanyForm.propTypes = {
  host: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  countries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  organisationTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  regions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  sectors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
}

export default AddCompanyForm
