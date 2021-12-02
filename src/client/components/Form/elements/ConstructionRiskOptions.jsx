import React from 'react'

import ConstructionRisksResource from '../../Resource/ConstructionRisks'
import ResourceOptionsField from './ResourceOptionsField'
import FieldRadios from './FieldRadios'

const ConstructionRiskOptions = (props) => (
  <ResourceOptionsField
    legend="Construction risk"
    {...props}
    resource={ConstructionRisksResource}
  />
)

export const FieldConstructionRiskRadios = (props) => (
  <ConstructionRiskOptions {...props} field={FieldRadios} />
)
