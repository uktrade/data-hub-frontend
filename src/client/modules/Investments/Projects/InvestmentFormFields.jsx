/**
 * Fields shared by the add/edit investment project forms
 */

import React from 'react'

import {
  FieldAdvisersTypeahead,
  FieldInput,
  FieldTextarea,
  FieldTypeahead,
} from '../../../components'
import {
  BusinessActivitiesResourse,
  CompanyContactsResource,
  FDITypesResource,
  SectorResource,
} from '../../../components/Resource'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { transformArrayForTypeahead } from './transformers'

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

export const FieldBusinessActivity = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="business_activities"
    label="Business activities"
    resource={BusinessActivitiesResourse}
    field={FieldTypeahead}
    initialValue={initialValue}
    isMulti={true}
    placeholder="Choose a business activity"
    hint="You can select more than one activity"
  />
)

export const FieldClientContacts = ({ initialValue = null, companyId }) => (
  <ResourceOptionsField
    name="client_contacts"
    label="Client contact details"
    resource={CompanyContactsResource}
    id={companyId}
    field={FieldTypeahead}
    resultToOptions={({ results }) => transformArrayForTypeahead(results)}
    initialValue={initialValue}
    isMulti={true}
    placeholder="Choose a client contact"
    required="Choose a client contact"
  />
)

export const FieldReferralSourceAdviser = ({
  label = null,
  initialValue = null,
  typeaheadInitialValue = null,
}) => (
  <FieldRadios
    name="is_referral_source"
    legend="Are you the referral source for this project?"
    required="Select yes if you're the referral source for this project"
    initialValue={initialValue}
    options={OPTIONS_YES_NO.map((option) => ({
      ...option,
      ...(option.value === OPTION_NO && {
        children: (
          <FieldAdvisersTypeahead
            name="referral_source_adviser"
            label={label}
            initialValue={typeaheadInitialValue}
            placeholder="Choose a referral source adviser"
            required="Choose a referral source adviser"
            aria-label="Choose a referral source adviser"
          />
        ),
      }),
    }))}
  />
)
