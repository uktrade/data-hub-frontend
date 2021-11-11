import _ from 'lodash'
import React from 'react'

import UKRegionsResource from '../../Resource/UKRegions'
import FieldTypeahead from './FieldTypeahead'

const FieldUKRegionTypeahead = ({ ...props }) => (
  <UKRegionsResource>
    {(regions) => (
      <FieldTypeahead
        {...props}
        label="UK regions"
        options={regions.map(({ name, id }) => ({ label: name, value: id }))}
        placeholder="-- Select UK region --"
        aria-label="Select a uk region"
      />
    )}
  </UKRegionsResource>
)

FieldUKRegionTypeahead.propTypes = _.omit(
  FieldTypeahead.propTypes,
  'label',
  'options',
  'placeholder',
  'aria-label'
)

export default FieldUKRegionTypeahead
