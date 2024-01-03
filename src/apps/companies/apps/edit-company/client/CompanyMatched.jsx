import React from 'react'
import PropTypes from 'prop-types'
import Paragraph from '@govuk-react/paragraph'
import { H4 } from '@govuk-react/heading'

import { currencyGBP } from '../../../../../client/utils/number-utils'
import {
  FieldInput,
  FieldSelect,
  FieldUneditable,
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

    <FieldUneditable
      label="Annual turnover"
      name="turnover"
      data-test="company-matched-annual-turnover"
    >
      {!company.turnover_gbp && !company.turnover_range
        ? 'Not set'
        : company.turnover_gbp
          ? currencyGBP(company.turnover_gbp, {
              maximumSignificantDigits: 2,
            })
          : company.turnover_range.name}
    </FieldUneditable>

    <FieldUneditable
      label="Number of employees"
      name="number_of_employees"
      data-test="company-matched-number-of-employees"
    >
      {!company.number_of_employees && !company.employee_range
        ? 'Not set'
        : company.number_of_employees
          ? company.number_of_employees.toString()
          : company.employee_range.name}
    </FieldUneditable>

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
        label="DBT sector"
        emptyOption="-- Select DBT sector --"
        options={sectors}
        required="Select DBT sector"
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
