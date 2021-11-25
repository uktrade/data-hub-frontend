import React from 'react'

import ConstructionRisksResource from '../../Resource/ConstructionRisks'
import ResourceOptionsField from './ResourceOptionsField'
import FieldRadios from './FieldRadios'

const ConstructionRiskOptions = (props) => (
  <ResourceOptionsField
    legend="Construction risk"
    {...props}
    resource={ConstructionRisksResource}
    resultToOptions={(result) =>
      result.map(({ name, id }) => ({
        label: name,
        value: id,
      }))
    }
  />
)

export const FieldConstructionRiskRadios = (props) => (
  <ConstructionRiskOptions {...props} field={FieldRadios} />
)
