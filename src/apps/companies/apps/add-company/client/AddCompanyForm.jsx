import React, { useState } from 'react'
import { H3, LoadingBox } from 'govuk-react'
import PropTypes from 'prop-types'
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

  function getCountry (values) {
    if (values.companyLocation && values.companyLocation === COMPANY_LOCATION_OPTIONS.uk.value) {
      return COMPANY_LOCATION_OPTIONS.uk.label
    }

    if (values.companyOverseasCountry) {
      return foreignCountries.find(c => c.value === values.companyOverseasCountry).label
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
              name="dnb_company"
            />
          </Step>

          <Step name="companyDetails" forwardButtonText="Add company">
            <H3>Add this company to Data Hub</H3>

            <DefinitionList header="Samsung Venture Investment">
              <DefinitionList.Row
                label="Sector"
                description="Business (and Consumer) services"
              />
              <DefinitionList.Row
                label="UK region"
                description="LONDON"
              />
              <DefinitionList.Row
                label="Address"
                description="Samsung HQ, 44 Riverbank House, Great West Road, Brentford, Middlesex"
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
