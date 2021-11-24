import React from 'react'

import AdvisersResource from '../../Resource/Advisers'
import FieldTaskTypeahead from './FieldTaskTypeahead'

const FieldActiveITA = (props) => (
  <FieldTaskTypeahead
    label="Select an ITA"
    placeholder="-- Select ITA --"
    {...props}
    taskName={AdvisersResource.taskName}
    interceptOptionsPayload={(query) => ({
      autocomplete: query,
      dit_team__role: '5e329c18-6095-e211-a939-e4115bead28a',
      is_active: 'true',
    })}
    resultToOptions={(result) =>
      AdvisersResource.transformer(result)[0].map(({ name, id, ditTeam }) => ({
        value: id,
        label: `${name}, ${ditTeam.name}`,
      }))
    }
  />
)

export default FieldActiveITA
