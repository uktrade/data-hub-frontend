import React from 'react'

import { AssetClassesResource } from '../../Resource'
import FieldTypeahead from './FieldTypeahead'
import ResourceOptionsField from './ResourceOptionsField'

const AssetClassOptions = (props) => (
  <ResourceOptionsField
    label="Asset classes"
    placeholder="-- Select asset class --"
    aria-label="Select asset classes"
    {...props}
    resource={AssetClassesResource}
  />
)

export const FieldAssetClassTypeahead = (props) => (
  <AssetClassOptions {...props} field={FieldTypeahead} />
)
