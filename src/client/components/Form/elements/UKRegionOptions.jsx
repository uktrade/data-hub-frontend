import React from 'react'

import UKRegionsResource from '../../Resource/UKRegions'
import FieldTypeahead from './FieldTypeahead'
import ResourceOptionsField from './ResourceOptionsField'

const UKRegionOptions = (props) => (
  <ResourceOptionsField
    label="UK regions"
    placeholder="-- Select UK region --"
    aria-label="Select a uk region"
    {...props}
    resource={UKRegionsResource}
  />
)

export const FieldUKRegionTypeahead = (props) => (
  <UKRegionOptions {...props} field={FieldTypeahead} />
)
