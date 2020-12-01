import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import { omit } from 'lodash'
import dateFns from 'date-fns'

import { Chip } from '..'

const removeParamFromQs = (qsParams, queryParam, targetValue = null) => {
  /*
   * Removes the queryParam with targetValue from qsParams
   *
   * When the query param contains an array of values it removes the item with
   * the given target value, otherwise it removes that param entirely.
   */
  return Object.entries(qsParams)
    .map(([key]) => {
      if (key === queryParam) {
        return Array.isArray(qsParams[key])
          ? {
              ...qsParams,
              [key]: qsParams[key].filter((x) => x !== targetValue),
            }
          : omit(qsParams, queryParam)
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
      const chips = selectedOptions.filter(({ value }) => value)
      return chips.map(({ value, label }) => (
        <Chip
          key={`filter-chip-${value}`}
          value={value}
          onClick={() => clearFilter(value)}
          {...props}
        >
          {asDate ? `${label}: ${dateFns.format(value, 'D MMMM YYYY')}` : label}
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
