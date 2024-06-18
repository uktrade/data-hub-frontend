import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import RoutedTypeahead from '../RoutedTypeahead'

import Task from '../Task'

import { apiProxyAxios } from '../Task/utils'
import { transformIdNameToValueLabel } from '../../transformers'

const parseCompanyData = (companies) =>
  companies
    .filter((company) => company.name && company.name.trim().length)
    .map(transformIdNameToValueLabel)

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
  closeMenuOnSelect = true,
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

RoutedCompanyTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  taskProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  closeMenuOnSelect: PropTypes.bool,
}

export default RoutedCompanyTypeahead
