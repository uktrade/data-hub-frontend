import React from 'react'
import PropTypes from 'prop-types'
import Paragraph from '@govuk-react/paragraph'
import { H4 } from '@govuk-react/heading'

import {
  FieldInput,
  FieldSelect,
  FieldWrapper,
} from '../../../../../client/components'
import OneListFields from './OneListFields'
import CommonFields from './CommonFields'

const CompanyMatched = ({
  company,
  regions,
  sectors,
  headquarterTypes,
  oneListEmail,
  isOnOneList,
  features,
}) => (
  <>
    <FieldInput label="Company name" name="name" type="text" />

    <CommonFields company={company} regions={regions} features={features} />

    {/* <FieldInput
      label="Annual turnover"
      hint="Amount in GBP"
      name="turnover"
      type="number"
      data-test="company-matched-annual-turnover"
    /> */}

    <FieldWrapper
      legend="Annual turnover"
      name="turnover"
      data-test="company-matched-annual-turnover"
    >
      <Paragraph>{company.turnover_range.name}</Paragraph>
    </FieldWrapper>

    <FieldWrapper
      legend="Number of employees"
      name="number_of_employees"
      data-test="company-matched-number-of-employees"
    >
      <Paragraph>{company.employee_range.name}</Paragraph>
    </FieldWrapper>

    {isOnOneList ? (
      <OneListFields
        company={company}
        oneListEmail={oneListEmail}
        sectors={sectors}
        headquarterTypes={headquarterTypes}
      />
    ) : (
      <FieldSelect
        name="sector"
        label="DIT sector"
        emptyOption="-- Select DIT sector --"
        options={sectors}
        required="Select DIT sector"
      />
    )}

    <H4 as="h2">After you click submit</H4>

    <Paragraph>
      Changes will be reviewed by our third-party data supplier and updated.
      Business description, website, region and sector are not updated by third
      parties.
    </Paragraph>
  </>
)

CompanyMatched.propTypes = {
  company: PropTypes.object.isRequired,
  features: PropTypes.object,
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
  headquarterTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  oneListEmail: PropTypes.string.isRequired,
  isOnOneList: PropTypes.bool.isRequired,
}

export default CompanyMatched
