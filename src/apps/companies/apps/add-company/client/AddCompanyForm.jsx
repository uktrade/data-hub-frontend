/* eslint-disable camelcase */

import React, { useState } from 'react'
import { H3, LoadingBox } from 'govuk-react'
import PropTypes from 'prop-types'
import { compact, get } from 'lodash'
import {
  FieldDnbCompany,
  FieldRadios,
  FieldSelect,
  Form,
  Step
} from 'data-hub-components'

import DefinitionList from './DefinitionList'

const COMPANY_LOCATION_OPTIONS = {
  uk: {
    label: 'UK',
    value: 'uk',
  },
  overseas: {
    label: 'Overseas',
    value: 'overseas',
  },
}

function AddCompanyForm ({ host, csrfToken, foreignCountries }) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function getCountry ({ companyLocation, companyOverseasCountry }) {
    if (companyLocation && companyLocation === COMPANY_LOCATION_OPTIONS.uk.value) {
      return COMPANY_LOCATION_OPTIONS.uk.label
    }

    if (companyOverseasCountry) {
      return foreignCountries.find(c => c.value === companyOverseasCountry).label
    }
  }

  function getCompanyName ({ dnbCompany }) {
    return get(dnbCompany, 'primary_name')
  }

  function getCompanyAddress ({ dnbCompany }) {
    if (dnbCompany) {
      return compact([
        dnbCompany.address_line_1,
        dnbCompany.address_line_2,
        dnbCompany.address_town,
        dnbCompany.address_postcode,
      ]).join(', ')
    }
  }

  function getCompaniesHouseNumber ({ dnbCompany }) {
    if (dnbCompany) {
      const companiesHouseAccount = dnbCompany.registration_numbers
        .find(({ registration_type }) => registration_type === 'uk_companies_house_number')

      if (companiesHouseAccount) {
        return companiesHouseAccount.registration_number
      }
    }
  }

  async function submitCallback () {
    setIsSubmitting(true)
    await timeout(1000)
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p>Form submitted, thank you.</p>
    )
  }

  return (
    <Form onSubmit={submitCallback}>
      {form => (
        <LoadingBox loading={isSubmitting}>
          <Step name="companyLocation">
            <FieldRadios
              name="companyLocation"
              label={<H3>Where is this company based?</H3>}
              required="Specify location of the company"
              options={[
                COMPANY_LOCATION_OPTIONS.uk,
                {
                  ...COMPANY_LOCATION_OPTIONS.overseas,
                  children: (
                    <FieldSelect
                      required="Select in which country the company is based"
                      label="Country"
                      name="companyOverseasCountry"
                      options={foreignCountries}
                    />
                  ),
                },
              ]}
            />
          </Step>

          <Step name="companySearch" hideForwardButton={true}>
            <H3>Find the company</H3>

            <FieldDnbCompany
              apiEndpoint={`//${host}/companies/create/dnb/company-search?_csrf=${csrfToken}`}
              country={getCountry(form.values)}
              name="dnbCompany"
            />
          </Step>

          <Step name="companyDetails" forwardButtonText="Add company">
            <H3>Confirm you want to add this company to Data Hub</H3>

            <DefinitionList header={getCompanyName(form.values)}>
              <DefinitionList.Row
                label="Companies House number"
                description={getCompaniesHouseNumber(form.values)}
              />
              <DefinitionList.Row
                label="Address"
                description={getCompanyAddress(form.values)}
              />
            </DefinitionList>
          </Step>
        </LoadingBox>
      )}
    </Form>
  )
}

AddCompanyForm.propTypes = {
  host: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  foreignCountries: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
}

export default AddCompanyForm
