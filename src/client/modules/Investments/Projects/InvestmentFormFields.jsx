/**
 * Fields shared by the add/edit investment project forms
 */

import React from 'react'

import { FieldTypeahead } from '../../../components'
import { FDITypesResource } from '../../../components/Resource'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'

export const FieldFDIType = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="fdi_type"
    label="Type of foreign direct investment (FDI)"
    resource={FDITypesResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    placeholder="Select an FDI type"
    required="Select the FDI type"
  />
)
