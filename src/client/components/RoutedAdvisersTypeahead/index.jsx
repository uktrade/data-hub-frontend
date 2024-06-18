import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'

import Task from '../Task'

import { parseAdviserData } from '../../../common/formatAdviser'
import { apiProxyAxios } from '../Task/utils'

const fetchAdvisers = (onlyShowActiveAdvisers) => {
  return throttle((searchString) => {
    if (searchString.length) {
      return apiProxyAxios
        .get('/adviser/', {
          params: {
            autocomplete: searchString,
            is_active: onlyShowActiveAdvisers ? true : null,
          },
        })
        .then(({ data: { results } }) => parseAdviserData(results))
    } else {
      return Promise.resolve([])
    }
  }, 500)
}

const RoutedAdvisersTypeahead = ({
  taskProps,
  closeMenuOnSelect = true,
  onlyShowActiveAdvisers = true,
  loadOptions = fetchAdvisers(onlyShowActiveAdvisers),
  ...props
}) => (
  <Task.Status {...taskProps} progressOverlay={true}>
    {() => (
      <RoutedTypeahead
        loadOptions={loadOptions}
        closeMenuOnSelect={closeMenuOnSelect}
        {...props}
      />
    )}
  </Task.Status>
)

RoutedAdvisersTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  closeMenuOnSelect: PropTypes.bool,
}

export default RoutedAdvisersTypeahead
