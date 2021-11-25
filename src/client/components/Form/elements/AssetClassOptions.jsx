import React from 'react'

import AssetClassesResource from '../../Resource/AssetClasses'
import FieldTypeahead from './FieldTypeahead'
import ResourceOptionsField from './ResourceOptionsField'

const AssetClassOptions = (props) => (
  <ResourceOptionsField
    label="Asset classes"
    placeholder="-- Select asset class --"
    aria-label="Select asset classes"
    {...props}
    resource={AssetClassesResource}
    resultToOptions={(result) =>
      result.map(({ name, id }) => ({
        label: name,
        value: id,
      }))
    }
  />
)

export const FieldAssetClassTypeahead = (props) => (
  <AssetClassOptions {...props} field={FieldTypeahead} />
)
