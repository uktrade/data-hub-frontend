/**
 * Functional tests: ./test/functional/cypress/specs/companies/add-company-spec.js
 */

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { get } from 'lodash'
import { H3 } from '@govuk-react/heading'

import { FieldDnbCompany, FieldRadios, FieldSelect, Form, Step } from 'data-hub-components'

import CompanyFoundStep from './CompanyFoundStep'
import CompanyNotFoundStep from './CompanyNotFoundStep'
import { ISO_CODE } from './constants'

function AddCompanyForm ({ csrfToken, countries, organisationTypes, regions, sectors }) {
  const optionCountryUK = countries.find(({ value }) => value === ISO_CODE.UK)
  const overseasCountries = countries.filter(({ value }) => value && value !== ISO_CODE.UK)

  const COMPANY_LOCATION_OPTIONS = {
    uk: optionCountryUK,
    overseas: {
      label: 'Overseas',
      value: 'overseas',
      children: (
        <FieldSelect
          required="Select in which country the company is located"
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

    return {}
  }

  async function onSubmit (values) {
    const path = values.cannotFind ? 'company-investigation' : 'company-create'
    const postUrl = `/companies/create/dnb/${path}?_csrf=${csrfToken}`
    const { data } = await axios.post(postUrl, values)
    return `/companies/${data.id}`
  }

  return (
    <Form onSubmit={onSubmit}>
      {({ values, setFieldValue }) => {
        const country = getCountry(values)
        const countryID = get(country, 'key')
        const countryName = get(country, 'label')
        const countryIsoCode = get(country, 'value')

        useEffect(() => {
          setFieldValue('country', countryID)
        }, [countryID])

        return (
          <div>
            <Step name="companyLocation">
              <H3>Where is this company located?</H3>

              <FieldRadios
                name="companyLocation"
                required="Specify location of the company"
                options={Object.values(COMPANY_LOCATION_OPTIONS)}
              />
            </Step>

            <Step name="companySearch" forwardButton={null} backButton={null}>
              <H3>Find the company</H3>

              <FieldDnbCompany
                apiEndpoint={`/companies/create/dnb/company-search?_csrf=${csrfToken}`}
                queryParams={{ address_country: countryIsoCode }}
                name="dnbCompany"
                country={countryName}
              />
            </Step>

            {!values.cannotFind && <CompanyFoundStep countryName={countryName} />}

            {values.cannotFind && (
              <CompanyNotFoundStep
                organisationTypes={organisationTypes}
                regions={regions}
                sectors={sectors}
                country={country}
              />
            )}
          </div>
        )
      }}
    </Form>
  )
}

AddCompanyForm.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  countries: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
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
