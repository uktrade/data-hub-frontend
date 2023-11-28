import React from 'react'
import { useLocation } from 'react-router-dom'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import BusinessPotential from '../../../components/Resource/BusinessPotential'
import UKRegions from '../../../components/Resource/UKRegions'
import Experience from '../../../components/Resource/Experience'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { CompanyContactsResource } from '../../../components/Resource'
import { idNameToValueLabel } from '../../../../client/utils'
import Task from '../../../components/Task'
import { steps } from './constants'
import {
  Step,
  FieldTypeahead,
  ContactInformation,
  FieldRadios,
  FieldSelect,
} from '../../../components'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../components/ContactForm/state'
import { ID } from './state'

const CustomerDetailsStep = () => {
  const { values } = useFormContext()
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)

  return (
    <Step name={steps.CUSTOMER_DETAILS}>
      <h1>Customer details</h1>
      <ResourceOptionsField
        name="contacts"
        id={queryParams.company}
        label="Company contacts"
        required="Select a contact"
        isMulti={true}
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
              companyId={queryParams.company}
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
        field={FieldSelect}
        resource={UKRegions}
      />
      <ResourceOptionsField
        name="business_potential"
        id="business-potential"
        label="Export potential"
        field={FieldRadios}
        resource={BusinessPotential}
      />
      <ResourceOptionsField
        name="experience"
        id="experience"
        label="Export experience"
        hint="You customer will be asked to confirm this information"
        field={FieldRadios}
        resource={Experience}
      />
    </Step>
  )
}

export default CustomerDetailsStep
