import React from 'react'

import { OpportunityValueTypesResource } from '../../Resource'
import ResourceOptionsField from './ResourceOptionsField'
import FieldRadios from './FieldRadios'

const OpportunityValueTypeOptions = (props) => (
  <ResourceOptionsField
    legend="Opportunity value type"
    {...props}
    resource={OpportunityValueTypesResource}
  />
)

export const FieldOpportunityValueTypeRadios = (props) => (
  <OpportunityValueTypeOptions {...props} field={FieldRadios} />
)
