import React from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import FieldTypeahead from '../FieldTypeahead'
import { parseAdviserData } from '../../../../../common/formatAdviser'
import { apiProxyAxios } from '../../../Task/utils'

const FieldAdvisersTypeahead = ({
  name,
  label = '',
  required,
  isMulti,
  onlyShowActiveAdvisers = true,
  placeholder = 'Type to search for advisers',
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder={placeholder}
      noOptionsMessage="Type to search for advisers"
      required={required}
      loadOptions={throttle(
        (searchString) =>
          apiProxyAxios
            .get('/adviser/', {
              params: {
                autocomplete: searchString,
                is_active: onlyShowActiveAdvisers,
              },
            })
            .then(({ data: { results } }) => parseAdviserData(results)),
        500
      )}
      isMulti={isMulti}
      {...props}
    />
  )
}

FieldAdvisersTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
}

export default FieldAdvisersTypeahead
