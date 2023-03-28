/**
 * @todo Remove this component once all of the companies are matched.
 */

import React from 'react'
import PropTypes from 'prop-types'

import { FieldRadios, FieldSelect } from '../../../../../client/components'
import OneListFields from './OneListFields'
import CommonFields from './CommonFields'

const CompanyUnmatched = ({
  company,
  regions,
  sectors,
  headquarterTypes,
  oneListEmail,
  isOnOneList,
  turnoverRanges,
  employeeRanges,
  features,
}) => (
  <>
    <CommonFields company={company} regions={regions} features={features} />

    <FieldRadios
      label="Annual turnover (optional)"
      name="turnover_range"
      options={turnoverRanges}
      data-test="company-unmatched-annual-turnover"
    />

    <FieldRadios
      label="Number of employees (optional)"
      name="employee_range"
      options={employeeRanges}
      data-test="company-unmatched-number-of-employees"
    />

    {isOnOneList ? (
      <OneListFields
        company={company}
        oneListEmail={oneListEmail}
        sectors={sectors}
        headquarterTypes={headquarterTypes}
      />
    ) : (
      <>
        <FieldSelect
          name="sector"
          label="DBT sector"
          emptyOption="-- Select DBT sector --"
          options={sectors}
          required="Select DBT sector"
        />
        <FieldRadios
          name="headquarter_type"
          label="Business hierarchy"
          options={headquarterTypes}
        />
      </>
    )}
  </>
)

CompanyUnmatched.propTypes = {
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
  turnoverRanges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  employeeRanges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default CompanyUnmatched
