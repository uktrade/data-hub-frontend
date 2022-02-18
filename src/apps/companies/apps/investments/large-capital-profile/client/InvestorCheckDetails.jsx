import React from 'react'
import { LabelText } from 'govuk-react'
import PropTypes from 'prop-types'

import {
  FieldAdvisersTypeahead,
  FieldDate,
} from '../../../../../../client/components'

import { validateDateWithinOneYearFromToday } from './validators'

export const InvestorCheckDetails = ({ date, adviser, label }) => {
  return (
    <>
      <LabelText>{label}</LabelText>
      <FieldDate
        name="date"
        label="Date of most recent checks"
        initialValue={date}
        validate={validateDateWithinOneYearFromToday}
        required="Enter the date of the most recent checks"
        hint="For example, 12 11 2015"
      />
      <FieldAdvisersTypeahead
        name="adviser"
        label="Person responsible for most recent checks"
        placeholder="Select adviser"
        arial-label="Select adviser"
        initialValue={
          adviser ? [{ value: adviser.id, label: adviser.name }] : undefined
        }
        required="Enter the person responsible for the most recent checks"
      />
    </>
  )
}

InvestorCheckDetails.propTypes = {
  date: PropTypes.shape({
    year: PropTypes.string,
    month: PropTypes.string,
    day: PropTypes.string,
  }),
  adviser: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  label: PropTypes.string,
}
