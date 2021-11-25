import React from 'react'

import RequiredChecksConducted from '../../Resource/RequiredChecksConducted'
import ResourceOptionsField from './ResourceOptionsField'
import FieldRadios from './FieldRadios'

const RequiredChecksOptions = (props) => (
  <ResourceOptionsField
    {...props}
    resource={RequiredChecksConducted}
    resultToOptions={(result) =>
      result.map(({ name, id }) => ({
        label: name,
        value: id,
      }))
    }
  />
)

export const FieldRequiredChecksRadios = (props) => (
  <RequiredChecksOptions {...props} field={FieldRadios} />
)
