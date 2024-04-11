import React from 'react'

import { UKRegionsResource } from '../../Resource'
import FieldTypeahead from './FieldTypeahead'
import ResourceOptionsField from './ResourceOptionsField'
import { idNamesToValueLabels } from '../../../utils'

const filterActiveRegions = (regions) => {
  const activeRegions = regions.filter((region) => region.disabledOn === null)
  return idNamesToValueLabels(activeRegions)
}

const UKRegionOptions = (props) => (
  <ResourceOptionsField
    label="UK regions"
    placeholder="-- Select UK region --"
    aria-label="Select a uk region"
    {...props}
    resource={UKRegionsResource}
    resultToOptions={filterActiveRegions}
  />
)

export const FieldUKRegionTypeahead = (props) => (
  <UKRegionOptions {...props} field={FieldTypeahead} />
)
