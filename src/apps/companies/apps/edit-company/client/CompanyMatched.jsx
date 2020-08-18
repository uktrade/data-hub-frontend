import React from 'react'
import PropTypes from 'prop-types'
import Paragraph from '@govuk-react/paragraph'
import { H4 } from '@govuk-react/heading'

import { FieldInput, FieldSelect } from '../../../../../client/components'
import OneListFields from './OneListFields'
import CommonFields from './CommonFields'

const CompanyMatched = ({
  company,
  regions,
  sectors,
  headquarterTypes,
  oneListEmail,
  isOnOneList,
}) => (
  <>
    <FieldInput label="Company name" name="name" type="text" />

    <CommonFields company={company} regions={regions} />

    <FieldInput
      label="Annual turnover (optional)"
      hint="Amount in GBP"
      name="turnover"
      type="number"
    />

    <FieldInput
      label="Number of employees (optional)"
      name="number_of_employees"
      type="number"
    />

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
