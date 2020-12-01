import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Route } from 'react-router-dom'
import { omit } from 'lodash'

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

const RoutedFilterChips = ({ qsParamName, selectedOptions, ...props }) => (
  <Route>
    {({ location, history }) => {
      const clearFilter = (value) => {
        const qsParams = qs.parse(location.search.slice(1))
        history.push({
          search: qs.stringify(removeParamFromQs(qsParams, qsParamName, value)),
        })
      }
      return selectedOptions.map(({ value, label }) => (
        <Chip
          key={value}
          value={value}
          onClick={() => clearFilter(value)}
          {...props}
        >
          {label}
        </Chip>
      ))
    }}
  </Route>
)

RoutedFilterChips.propTypes = {
  qsParamName: PropTypes.string.isRequired,
  selectedOptions: PropTypes.array.isRequired,
}

export default RoutedFilterChips
