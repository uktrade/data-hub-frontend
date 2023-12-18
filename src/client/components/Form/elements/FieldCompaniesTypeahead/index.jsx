import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import FieldTypeahead from '../FieldTypeahead'
import { apiProxyAxios } from '../../../Task/utils'

const FieldCompaniesTypeahead = ({
  name,
  label,
  required,
  isMulti,
  onlyShowActiveCompanies = true,
  placeholder = 'Type to search for companies',
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder={placeholder}
      noOptionsMessage="Type to search for companies"
      required={required}
      loadOptions={throttle(
        (searchString) =>
          apiProxyAxios
            .get('/v4/company', {
              params: {
                autocomplete: searchString,
                is_active: onlyShowActiveCompanies,
              },
            })
            .then(({ data: { results } }) =>
              results.map(({ id, name }) => ({
                label: name,
                chipLabel: name,
                value: id,
              }))
            ),
        500
      )}
      isMulti={isMulti}
      {...props}
    />
  )
}

FieldCompaniesTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
}

export default FieldCompaniesTypeahead
