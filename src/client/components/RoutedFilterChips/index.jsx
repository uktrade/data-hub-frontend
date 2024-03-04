import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { useLocation, useNavigate } from 'react-router-dom-v5-compat'

import { omit } from 'lodash'

import { Chip } from '..'

/**
 * Removes the targetParam with targetValue from qsParams
 *
 * When the targetParam corresponds to an array of values it removes the item
 * with targetValue, otherwise it removes that param entirely.
 */
const removeParamFromQs = (qsParams, targetParam, targetValue = null) => {
  // FIXME: If the targetParam is not a key in qsParams the function returns
  //        undefined, which based on how it is used resets all filters
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

const RoutedFilterChips = ({ qsParamName, selectedOptions = [], ...props }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const clearFilter = (value) => {
    const qsParams = qs.parse(location.search.slice(1))
    const newQsParams = removeParamFromQs(qsParams, qsParamName, value)
    navigate({ search: qs.stringify(newQsParams) })
  }

  return selectedOptions.map(({ value, label, categoryLabel }) => (
    <Chip
      key={value}
      value={value}
      onClick={() => clearFilter(value)}
      {...props}
    >
      {categoryLabel ? `${categoryLabel}: ${label}` : label}
    </Chip>
  ))
}

RoutedFilterChips.propTypes = {
  qsParamName: PropTypes.string.isRequired,
  selectedOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      categoryLabel: PropTypes.string,
    })
  ),
}

export default RoutedFilterChips
