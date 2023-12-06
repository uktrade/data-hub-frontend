import React from 'react'
import { useLocation } from 'react-router-dom'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../components/ContactForm/state'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { idNameToValueLabel } from '../../../../client/utils'
import Task from '../../../components/Task'
import { ID } from './state'
import { steps } from './constants'
import {
  ExportResource,
  UKRegionsResource,
  CompanyContactsResource,
  ExportExperienceResource,
  BusinessPotentialResource,
} from '../../../components/Resource'
import {
  Step,
  FieldRadios,
  FieldSelect,
  FieldTypeahead,
  ContactInformation,
} from '../../../components'

const CustomerDetailsStep = () => {
  const { values } = useFormContext()
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)

  return (
    <Step name={steps.CUSTOMER_DETAILS}>
      <H3>Customer details</H3>

      {queryParams.export && (
        <PrepopulateFormFieldsFromExportProject
          exportProjectId={queryParams.export}
          companyId={queryParams.company}
          values={values}
        />
      )}
      {queryParams.exportwin && (
        <PrepopulateFormFieldsFromExportWin
          exportWinId={queryParams.exportwin}
          companyId={queryParams.company}
          values={values}
        />
      )}
      {!queryParams.export && !queryParams.exportwin && (
        <FormFields values={values} />
      )}
    </Step>
  )
}

const FormFields = ({ companyId, contact, exporterExperience, values }) => {
  return (
    <>
      <ResourceOptionsField
        name="contacts"
        id={companyId}
        label="Company contacts"
        required="Select a contact"
        placeholder="Select contact"
        resource={CompanyContactsResource}
        field={FieldTypeahead}
        autoScroll={true}
        resultToOptions={({ results }) => results.map(idNameToValueLabel)}
        initialValue={contact}
      />
      <Task>
        {(getTask) => {
          const openContactFormTask = getTask(TASK_REDIRECT_TO_CONTACT_FORM, ID)
          return (
            <ContactInformation
              companyId={companyId}
              onOpenContactForm={({ redirectUrl }) => {
                openContactFormTask.start({
                  payload: {
                    values,
                    url: redirectUrl,
                    storeId: ID,
                  },
                })
              }}
            />
          )
        }}
      </Task>
      <ResourceOptionsField
        name="uk_region"
        id="uk-region"
        label="HQ Location"
        required="Choose a HQ location"
        field={FieldSelect}
        resource={UKRegionsResource}
        fullWidth={true}
      />
      <ResourceOptionsField
        name="business_potential"
        id="business-potential"
        label="Export potential"
        required="Select export potential"
        field={FieldRadios}
        resource={BusinessPotentialResource}
      />
      <ResourceOptionsField
        name="experience"
        id="experience"
        label="Export experience"
        required="Select export experience"
        hint="You customer will be asked to confirm this information"
        field={FieldRadios}
        resource={ExportExperienceResource}
        initialValue={exporterExperience.value}
      />
    </>
  )
}

const PrepopulateFormFieldsFromExportProject = ({
  exportProjectId,
  companyId,
  values,
}) => (
  <ExportResource id={exportProjectId}>
    {(exportProject) => {
      return (
        <FormFields
          companyId={companyId}
          contact={
            exportProject.contacts.length === 1
              ? idNameToValueLabel(exportProject.contacts[0])
              : null
          }
          exporterExperience={idNameToValueLabel(
            exportProject.exporterExperience
          )}
          values={values}
        />
      )
    }}
  </ExportResource>
)

const PrepopulateFormFieldsFromExportWin = ({ exportWinId, values }) => (
  <ExportWinsResource id={exportWinId}>
    {(exportWin) => {
      return (
        <FormFields
          exportExperience={exportWin.exportExperience}
          values={values}
        />
      )
    }}
  </ExportWinsResource>
)

export default CustomerDetailsStep
