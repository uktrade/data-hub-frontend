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
  UKRegionsResource,
  CompanyContactsResource,
  ExportExperienceResource,
  BusinessPotentialResource,
} from '../../../components/Resource'
import {
  Step,
  FieldRadios,
  FieldTypeahead,
  ContactInformation,
} from '../../../components'

const CustomerDetailsStep = () => {
  const { values } = useFormContext()
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  const companyId = queryParams.company

  return (
    <Step name={steps.CUSTOMER_DETAILS}>
      <H3>Customer details</H3>
      <ResourceOptionsField
        name="contact"
        id={companyId}
        label="Company contacts"
        required="Select a contact"
        placeholder="Select contact"
        resource={CompanyContactsResource}
        field={FieldTypeahead}
        autoScroll={true}
        resultToOptions={({ results }) => results.map(idNameToValueLabel)}
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
        field={FieldTypeahead}
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
      {values.exporter_experience?.value}
      <ResourceOptionsField
        name="exporter_experience"
        id="exporter-experience"
        label="Export experience"
        required="Select export experience"
        hint="You customer will be asked to confirm this information"
        field={FieldRadios}
        resource={ExportExperienceResource}
      />
    </Step>
  )
}

export default CustomerDetailsStep
