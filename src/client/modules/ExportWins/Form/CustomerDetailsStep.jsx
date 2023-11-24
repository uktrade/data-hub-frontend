import React from 'react'
import { useLocation } from 'react-router-dom'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { CompanyContactsResource } from '../../../components/Resource'
import { idNameToValueLabel } from '../../../../client/utils'
import { Step, FieldTypeahead, ContactInformation } from '../../../components'
import Task from '../../../components/Task'
import { steps } from './constants'

import {
  TASK_REDIRECT_TO_CONTACT_FORM,
  ID,
} from '../../../components/ContactForm/state'

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
    </Step>
  )
}

export default CustomerDetailsStep
