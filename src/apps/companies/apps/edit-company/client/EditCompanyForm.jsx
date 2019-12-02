/* eslint-disable camelcase */

import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { get } from 'lodash'

import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import Paragraph from '@govuk-react/paragraph'
import {
  FieldInput,
  FieldRadios,
  FieldSelect,
  Form,
  FieldUneditable,
  FieldAddress,
  FormActions,
  StatusMessage,
} from 'data-hub-components'

import FieldWrapper from 'data-hub-components/dist/forms/elements/FieldWrapper'

import { WEBSITE_REGEX } from '../../add-company/client/constants'

// TODO: Move this validation to the component library
const websiteValidator = (value) => value && !WEBSITE_REGEX.test(value) ? 'Enter a valid website URL' : null

function EditCompanyForm ({
  csrfToken,
  companyDetails,
  turnoverRanges,
  employeeRanges,
  regions,
  sectors,
  headquarterTypes,
  oneListEmail,
  showCompanyNumberForUkBranch,
}) {
  const returnUrl = `/companies/${companyDetails.id}/business-details`
  const country = get(companyDetails, 'country', {})
  const sectorName = get(sectors.find(s => s.value === companyDetails.sector), 'label')
  const headquarterType = get(headquarterTypes.find(s => s.value === companyDetails.headquarter_type), 'label')

  const isBasedInUK = !!companyDetails.uk_based
  const isOnOneList = !!companyDetails.one_list_group_tier
  const isDnbCompany = !!companyDetails.duns_number

  async function onSubmit (values) {
    await axios.post(`/companies/${companyDetails.id}/edit`, values, {
      params: { _csrf: csrfToken },
    })
    return returnUrl
  }

  // TODO: Support nested form values to avoid transformation
  return (
    <Form onSubmit={onSubmit} initialValues={companyDetails}>
      {({ submissionError, values }) => (
        <>
          {submissionError && <StatusMessage>Company details could not be saved, try again later. {submissionError.message}</StatusMessage>}

          {!isDnbCompany && (
            <>
              {values.business_type && (
                <FieldUneditable name="business_type" label="Business type">
                  {values.business_type}
                </FieldUneditable>
              )}

              {!showCompanyNumberForUkBranch && companyDetails.company_number && (
                <FieldUneditable name="company_number" label="Companies House number">
                  {companyDetails.company_number}
                </FieldUneditable>
              )}

              {showCompanyNumberForUkBranch && (
                <FieldInput
                  label="BR Companies House number"
                  hint="Enter the company number of the UK branch."
                  name="company_number"
                  type="text"
                />
              )}

              <FieldInput
                label="Trading name (optional)"
                name="trading_names"
                type="text"
              />

              {isBasedInUK && (
                <FieldInput
                  label="VAT number (optional)"
                  name="vat_number"
                  type="text"
                />
              )}

              <FieldRadios
                label="Annual turnover (optional)"
                name="turnover_range"
                options={turnoverRanges}
              />

              <FieldRadios
                label="Number of employees (optional)"
                name="employee_range"
                options={employeeRanges}
              />

              <FieldInput
                label="Company's website (optional)"
                name="website"
                type="url"
                validate={websiteValidator}
              />

              <FieldAddress
                legend="Address"
                name="address"
                hint="This should be the address for this particular office of the business. If you need to record activity or a contact for a different address, please add a new company record to Data Hub."
                country={country}
                apiEndpoint="/api/postcodelookup"
              />

              {companyDetails.registered_address && (
                // TODO: Make this a component.
                <FieldWrapper name="registered_address" legend="Registered address" showBorder={true}>
                  <Paragraph>
                    A registered office address is a legal requirement of all limited companies and Limited Liability
                    Partnerships (LLPs) incorporated in the UK. Its purpose is to provide Companies House, HMRC and other
                    relevant government bodies with an official address for delivering statutory mail and legal notices.
                  </Paragraph>

                  {companyDetails.registered_address.line_1 && <div>{companyDetails.registered_address.line_1}</div>}
                  {companyDetails.registered_address.line_2 && <div>{companyDetails.registered_address.line_2}</div>}
                  {companyDetails.registered_address.town && <div>{companyDetails.registered_address.town}</div>}
                  {companyDetails.registered_address.county && <div>{companyDetails.registered_address.county}</div>}
                  {companyDetails.registered_address.postcode && <div>{companyDetails.registered_address.postcode}</div>}
                  {companyDetails.registered_address.country && <div>{companyDetails.registered_address.country.name}</div>}
                </FieldWrapper>
              )}
            </>
          )}

          <FieldInput
            label="Business description (optional)"
            name="description"
            type="text"
          />

          {isBasedInUK && (
            <FieldSelect
              name="uk_region"
              label="DIT region"
              emptyOption="-- Select DIT region --"
              options={regions}
              required="Select DIT region"
            />
          )}

          {isOnOneList && (
            <>
              <FieldUneditable name="sector" label="Sector">
                {sectorName || 'Not set'}
              </FieldUneditable>

              <Details summary="Need to edit the sector?" data-test="sector-details">
                If you need to change the sector for a company on the One List,
                please email <Link href={`mailto:${oneListEmail}`}>{oneListEmail}</Link>
              </Details>

              <FieldUneditable name="headquarter_type" label="Business hierarchy">
                {headquarterType || 'Not set'}
              </FieldUneditable>

              <Details summary="Need to edit the headquarter type?" data-test="headquarter_type-details">
                If you need to change the headquarter type for a company on the One List,
                please email <Link href={`mailto:${oneListEmail}`}>{oneListEmail}</Link>
              </Details>
            </>
          )}

          {!isOnOneList && (
            <>
              <FieldSelect
                name="sector"
                label="DIT sector"
                emptyOption="-- Select DIT sector --"
                options={sectors}
                required="Select DIT sector"
              />

              {!isDnbCompany && (
                <FieldRadios
                  name="headquarter_type"
                  label="Business hierarchy"
                  options={headquarterTypes}
                />
              )}
            </>
          )}

          <FormActions>
            <Button>Save and return</Button>
            <Link href={returnUrl}>Return without saving</Link>
          </FormActions>
        </>
      )}
    </Form>
  )
}

EditCompanyForm.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  companyDetails: PropTypes.object.isRequired,
  turnoverRanges: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  employeeRanges: PropTypes.arrayOf(PropTypes.shape({
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
  headquarterTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  oneListEmail: PropTypes.string.isRequired,
  showCompanyNumberForUkBranch: PropTypes.bool.isRequired,
}

export default EditCompanyForm
