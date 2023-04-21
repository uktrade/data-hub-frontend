import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'

import Task from '../Task'

import { apiProxyAxios } from '../Task/utils'

const parseCompanyData = (companies) =>
  companies
    .filter((company) => company.name && company.name.trim().length)
    .map(({ id, name }) => ({
      label: name,
      value: id,
    }))

const fetchCompanies = () => {
  return throttle((searchString) => {
    if (searchString.length) {
      return apiProxyAxios
        .get('/v4/company', {
          params: {
            autocomplete: searchString,
          },
        })
        .then(({ data }) => parseCompanyData(data.results))
    } else {
      return Promise.resolve([])
    }
  }, 500)
}

const RoutedCompanyTypeahead = ({
  taskProps,
  loadOptions = fetchCompanies(),
  ...props
}) => (
  <Task.Status {...taskProps} progressOverlay={true}>
    {() => (
      <RoutedTypeahead
        loadOptions={loadOptions}
        closeMenuOnSelect={true}
        {...props}
      />
    )}
  </Task.Status>
)

RoutedCompanyTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default RoutedCompanyTypeahead
