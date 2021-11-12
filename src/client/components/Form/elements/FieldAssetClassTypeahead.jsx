import _ from 'lodash'
import React from 'react'

import AssetClassesResource from '../../Resource/AssetClasses'
import FieldTypeahead from './FieldTypeahead'

const FieldAssetClassTypeahead = ({ ...props }) => (
  <AssetClassesResource>
    {(assetClasses) => (
      <FieldTypeahead
        {...props}
        options={assetClasses.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
        label="Asset classes"
        placeholder="-- Select asset class --"
        aria-label="Select asset classes"
      />
    )}
  </AssetClassesResource>
)

FieldAssetClassTypeahead.propTypes = _.omit(
  FieldTypeahead.propTypes,
  'label',
  'options',
  'placeholder',
  'aria-label'
)

export default FieldAssetClassTypeahead
