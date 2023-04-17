import React from 'react'

import { RequiredChecksConductedResource } from '../../Resource'
import ResourceOptionsField from './ResourceOptionsField'
import FieldRadios from './FieldRadios'

const RequiredChecksOptions = (props) => (
  <ResourceOptionsField {...props} resource={RequiredChecksConductedResource} />
)

export const FieldRequiredChecksRadios = (props) => (
  <RequiredChecksOptions {...props} field={FieldRadios} />
)
