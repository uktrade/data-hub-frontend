import React from 'react'
import { throttle } from 'lodash'

import { parseAdviserData } from '../../../../common/formatAdviser'
import FieldTypeahead from './FieldTypeahead'
import { apiProxyAxios } from '../../Task/utils'

const FieldActiveITATypeahead = (props) => (
  <FieldTypeahead
    {...props}
    label="Select an ITA"
    placeholder="-- Select ITA --"
    noOptionsMessage="Type to search for advisers"
    loadOptions={throttle(
      (searchString) =>
        apiProxyAxios
          .get('/api-proxy/adviser/', {
            params: {
              autocomplete: searchString,
              is_active: 'true',
              dit_team__role: '5e329c18-6095-e211-a939-e4115bead28a',
            },
          })
          .then(({ data: { results } }) => parseAdviserData(results)),
      500
    )}
  />
)

export default FieldActiveITATypeahead
