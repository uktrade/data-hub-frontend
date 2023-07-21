/**
 * Fields shared by the add/edit investment project forms
 */

import React from 'react'

import { FieldInput, FieldTextarea, FieldTypeahead } from '../../../components'
import { FDITypesResource, SectorResource } from '../../../components/Resource'
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

export const FieldProjectName = ({
  initialValue = null,
  placeholder = null,
}) => (
  <FieldInput
    label="Project name"
    name="name"
    type="text"
    initialValue={initialValue}
    required="Enter the project name"
    placeholder={placeholder}
  />
)

export const FieldProjectDescription = ({
  initialValue = null,
  hint = null,
}) => (
  <FieldTextarea
    type="text"
    name="description"
    label="Project description"
    required="Enter a description"
    initialValue={initialValue}
    hint={hint}
  />
)

export const FieldAnonDescription = ({ initialValue = null }) => (
  <FieldTextarea
    type="text"
    name="anonymous_description"
    label="Anonymous project details (optional)"
    hint="Do not include company names, financial details or address details"
    initialValue={initialValue}
  />
)

export const FieldProjectSector = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="sector"
    label="Primary sector"
    resource={SectorResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    placeholder="Choose a sector"
  />
)
