import React from 'react'
import PropTypes from 'prop-types'

import { FieldAdvisersTypeahead, FieldDate } from '../../../../components'
import { isoStringToDateParts } from '../../../../utils/date'
import { validateDateWithinTheLastYear } from './validators'

export const InvestorCheckDetails = ({ date, adviser }) => (
  <>
    <FieldDate
      name="date"
      label="Date of most recent checks"
      initialValue={isoStringToDateParts(date)}
      validate={validateDateWithinTheLastYear}
      required="Enter the date of the most recent checks"
      hint="For example, 12 11 2015"
    />
    <FieldAdvisersTypeahead
      name="adviser"
      label="Person responsible for most recent checks"
      placeholder="Select adviser"
      aria-label="Select adviser"
      initialValue={
        adviser ? [{ value: adviser.id, label: adviser.name }] : undefined
      }
      required="Enter the person responsible for the most recent checks"
    />
  </>
)

InvestorCheckDetails.propTypes = {
  date: PropTypes.string,
  adviser: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  label: PropTypes.string,
}
