import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import FieldTypeahead from '../FieldTypeahead'
import { apiProxyAxios } from '../../../Task/utils'

const FieldInvestmentProjectTypeahead = ({
  name,
  label,
  required,
  placeholder = 'Type to search for investment projects',
  company = null,
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder={placeholder}
      noOptionsMessage=""
      required={required}
      loadOptions={throttle(
        (searchString) =>
          apiProxyAxios
            .get('/v3/investment', {
              params: {
                autocomplete: searchString,
                investor_company_id: company,
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
      {...props}
    />
  )
}

FieldInvestmentProjectTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
}

export default FieldInvestmentProjectTypeahead
