import React from 'react'

import OpportunityValueTypeResource from '../../Resource/OpportunityValueType'
import ResourceOptionsField from './ResourceOptionsField'
import FieldRadios from './FieldRadios'

const OpportunityValueTypeOptions = (props) => (
  <ResourceOptionsField
    legend="Opportunity value type"
    {...props}
    resource={OpportunityValueTypeResource}
  />
)

export const FieldOpportunityValueTypeRadios = (props) => (
  <OpportunityValueTypeOptions {...props} field={FieldRadios} />
)
