import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'

import Task from '../Task'

import { parseAdviserData } from '../../../common/formatAdviser'

const fetchAdvisers = (onlyShowActiveAdvisers) => {
  return throttle((searchString) => {
    if (searchString.length) {
      return axios
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
  onlyShowActiveAdvisers = true,
  loadOptions = fetchAdvisers(onlyShowActiveAdvisers),
  ...props
}) => (
  <Task.Status {...taskProps}>
    {() => (
      <RoutedTypeahead
        loadOptions={loadOptions}
        closeMenuOnSelect={true}
        {...props}
      />
    )}
  </Task.Status>
)

RoutedAdvisersTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default RoutedAdvisersTypeahead
