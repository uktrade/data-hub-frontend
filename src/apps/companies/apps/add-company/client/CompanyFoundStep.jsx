/* eslint-disable camelcase */

import React from 'react'
import { compact, get } from 'lodash'
import { H3 } from '@govuk-react/heading'
import { Step, useFormContext } from 'data-hub-components'

import DefinitionList from './DefinitionList'
import PropTypes from 'prop-types'

function getCompanyAddress (dnbCompany) {
  if (dnbCompany) {
    return compact([
      dnbCompany.address_line_1,
      dnbCompany.address_line_2,
      dnbCompany.address_town,
      dnbCompany.address_postcode,
    ]).join(', ')
  }
}

function getCompaniesHouseNumber (dnbCompany) {
  if (dnbCompany) {
    const companiesHouseAccount = dnbCompany.registration_numbers
      .find(({ registration_type }) => registration_type === 'uk_companies_house_number')

    if (companiesHouseAccount) {
      return companiesHouseAccount.registration_number
    }
  }
}

function CompanyFoundStep ({ countryName }) {
  const { values } = useFormContext()

  const dnbCompany = get(values, 'dnbCompany')
  const companyName = get(dnbCompany, 'primary_name')
  const companyAddress = getCompanyAddress(dnbCompany)
  const companiesHouseNumber = getCompaniesHouseNumber(dnbCompany)

  return (
    <Step name="companyDetails" forwardButtonText="Add company">
      <H3>Confirm you want to add this company to Data Hub</H3>

      <DefinitionList header={companyName}>
        <DefinitionList.Row
          label="Companies House number"
          description={companiesHouseNumber}
        />
        <DefinitionList.Row
          label="Country"
          description={countryName}
        />
        <DefinitionList.Row
          label="Address"
          description={companyAddress}
        />
      </DefinitionList>
    </Step>
  )
}

CompanyFoundStep.propTypes = {
  countryName: PropTypes.string.isRequired,
}

export default CompanyFoundStep
