import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { throttle } from 'lodash'
import { FieldTypeahead } from 'data-hub-components'

import { parseAdviserData } from '../../utils/formatAdviser'

const AdviserTypeAhead = ({ name, label, required, isMulti }) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder="-- Select adviser --"
      noOptionsMessage={() => 'Type to search for advisers'}
      required={required}
      loadOptions={throttle(
        (searchString) =>
          axios
            .get('/api-proxy/adviser/', {
              params: {
                autocomplete: searchString,
              },
            })
            .then(({ data: { results } }) => parseAdviserData(results)),
        500
      )}
      isMulti={isMulti}
    />
  )
}

AdviserTypeAhead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  isMulti: PropTypes.bool,
}

export default AdviserTypeAhead
