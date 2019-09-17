import React from 'react'
import { H3 } from '@govuk-react/heading'
import { FieldInput, FieldRadios, FieldSelect, Step } from 'data-hub-components'

import { Details, ListItem, UnorderedList } from 'govuk-react'
import PropTypes from 'prop-types'

function CompanyNotFoundStep ({ organisationTypes, regions, sectors }) {
  return (
    <Step name="unhappy" forwardButtonText="Add company">

      <Details summary="Why am I seeing this?">
        The company you want to add to Data Hub cannot be found in the external databases Data Hub checks.
        You will need to provide information about the company, so the company can be added to Data Hub
        while the Data Hub support team checks with the company the information you have provided.
      </Details>

      <FieldRadios
        name="business_type"
        label="Organisation type"
        required="Select organisation"
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
        required="Enter website"
        type="url"
      />

      <FieldInput
        label="Company's telephone number (optional)"
        name="telephone_number"
        type="tel"
      />

      <FieldSelect
        name="uk_region"
        label="DIT region"
        emptyOption="-- Select DIT region --"
        options={regions}
        required="Select DIT region"
      />

      <FieldSelect
        name="sector"
        label="DIT sector"
        emptyOption="-- Select DIT sector --"
        options={sectors}
        required="Select DIT sector"
      />

      <H3>What happens next</H3>
      <p>
        You are requesting that a new company be added to Data Hub. Once you select the ‘Add company’ button below:
        <UnorderedList>
          <ListItem>
            you can continue to record interactions with the company
          </ListItem>
          <ListItem>
            Data Hub’s external data provider will confirm with the company that the information on this page is correct
          </ListItem>
          <ListItem>
            within 3 weeks the Data Hub support team will send you an email to tell you whether the information on this page has been confirmed
          </ListItem>
        </UnorderedList>
      </p>

    </Step>
  )
}

CompanyNotFoundStep.propTypes = {
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

export default CompanyNotFoundStep
