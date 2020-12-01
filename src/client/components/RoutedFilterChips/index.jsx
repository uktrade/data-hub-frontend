import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import { omit } from 'lodash'
import dateFns from 'date-fns'

import { Chip } from '..'

const removeParamFromQs = (qsParams, targetParam, targetValue = null) => {
  /*
   * Removes the targetParam with targetValue from qsParams
   *
   * When the targetParam corresponds to an array of values it removes the item
   * with targetValue, otherwise it removes that param entirely.
   */
  return Object.entries(qsParams)
    .map(([key]) => {
      if (key === targetParam) {
        return Array.isArray(qsParams[key])
          ? {
              ...qsParams,
              [key]: qsParams[key].filter((x) => x !== targetValue),
            }
          : omit(qsParams, targetParam)
      }
    })
    .filter(Boolean)[0]
}

const RoutedFilterChips = ({
  qsParamName,
  selectedOptions,
  asDate = false,
  ...props
}) => (
  <Route>
    {({ location, history }) => {
      const clearFilter = (value) => {
        const qsParams = qs.parse(location.search.slice(1))
        history.push({
          search: qs.stringify(removeParamFromQs(qsParams, qsParamName, value)),
        })
      }
      const filteredOptions = selectedOptions.filter(({ value }) => value)
      return filteredOptions.map(({ value, label }) => (
        <Chip
          key={value}
          value={value}
          onClick={() => clearFilter(value)}
          {...props}
        >
          {label} {asDate && `: ${dateFns.format(value, 'D MMMM YYYY')}`}
        </Chip>
      ))
    }}
  </Route>
)

RoutedFilterChips.propTypes = {
  qsParamName: PropTypes.string.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  asDate: PropTypes.bool,
}

export default RoutedFilterChips
