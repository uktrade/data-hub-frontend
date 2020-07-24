/* eslint-disable camelcase */

import React from 'react'
import { Details } from 'govuk-react'
import PropTypes from 'prop-types'
import { FieldInput, FieldRadios, Step } from 'data-hub-components'
import FieldAddress from 'data-hub-components/dist/forms/elements/FieldAddress'

import { WEBSITE_REGEX } from './constants'

const requiredWebsiteAndOrPhoneValidator = (
  value,
  name,
  { values: { website, telephone_number } }
) => {
  if (!telephone_number && !website) {
    return 'Enter a website or phone number'
  }

  if (telephone_number && !website) {
    return null
  }

  // TODO: Move this validation to the component library
  return !WEBSITE_REGEX.test(website) ? 'Enter a valid website URL' : null
}

function CompanyNotFoundStep({ organisationTypes, country }) {
  return (
    <Step name="unhappy">
      <Details summary="Why am I seeing this?">
        The company you want to add to Data Hub cannot be found in the external
        databases Data Hub checks. You will need to provide information about
        the company, so the company can be added to Data Hub while the Data Hub
        support team checks with the company the information you have provided.
      </Details>

      <FieldRadios
        name="business_type"
        label="Organisation type"
        required="Select organisation type"
        options={organisationTypes}
      />

      <FieldInput
        label="Name of company"
        name="name"
        required="Enter name"
        type="text"
      />

      <FieldInput
        label="Company's website"
        name="website"
        type="url"
        validate={requiredWebsiteAndOrPhoneValidator}
      />

      <FieldInput
        label="Company's telephone number"
        name="telephone_number"
        type="tel"
        validate={requiredWebsiteAndOrPhoneValidator}
      />

      <FieldAddress
        country={{
          id: country.key,
          name: country.label,
        }}
        apiEndpoint="/api/postcodelookup"
      />
    </Step>
  )
}

CompanyNotFoundStep.propTypes = {
  organisationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  country: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

export default CompanyNotFoundStep
