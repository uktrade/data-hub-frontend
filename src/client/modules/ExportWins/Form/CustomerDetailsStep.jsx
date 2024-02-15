import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../components/ContactForm/state'
import { Step, FieldTypeahead, ContactInformation } from '../../../components'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { idNameToValueLabel } from '../../../../client/utils'
import { OPTION_YES } from '../../../../common/constants'
import Task from '../../../components/Task'
import { ID } from './state'
import { steps, contributingAdvisersLimit } from './constants'
import {
  UKRegionsResource,
  CompanyContactsResource,
  ExportExperienceResource,
  BusinessPotentialResource,
} from '../../../components/Resource'

const CustomerDetailsStep = ({ sessionStorageFormValues }) => {
  const [sessionStorageValues] = useState(sessionStorageFormValues)
  const { values, setFieldValue } = useFormContext()
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  const companyId = queryParams.company

  useEffect(() => {
    // Please refer to the comments in state.js to understand
    // why form values are being written here.
    if (sessionStorageValues) {
      // Lead officer form step fields
      setFieldValue('lead_officer', sessionStorageValues.lead_officer)
      setFieldValue('team_type', sessionStorageValues.team_type)
      setFieldValue('hq_team', sessionStorageValues.hq_team)
      setFieldValue('team_members', sessionStorageValues.team_members)
      // Credit for this win form step fields
      setFieldValue('credit_for_win', sessionStorageValues.credit_for_win)
      if (sessionStorageValues.credit_for_win === OPTION_YES) {
        const fieldNames = ['team_type', 'contributing_officer', 'hq_team']
        fieldNames.forEach((fieldName) =>
          [...Array(contributingAdvisersLimit).keys()].forEach((index) => {
            const field = `${fieldName}_${index}`
            const fieldValue = sessionStorageValues?.[field]
            fieldValue && setFieldValue(field, fieldValue)
          })
        )
      }
    }
  }, [sessionStorageValues])

  return (
    <Step name={steps.CUSTOMER_DETAILS}>
      <H3 data-test="step-heading">Customer details</H3>
      <ResourceOptionsField
        name="company_contacts"
        id={companyId}
        label="Company contacts"
        hint="This contact will be emailed to approve the win."
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
        name="customer_location"
        id="customer-location"
        label="HQ location"
        required="Select HQ location"
        field={FieldTypeahead}
        resource={UKRegionsResource}
        fullWidth={true}
      />
      <ResourceOptionsField
        name="business_potential"
        id="business-potential"
        label="Export potential"
        required="Select export potential"
        field={FieldTypeahead}
        resource={BusinessPotentialResource}
      />
      <ResourceOptionsField
        name="export_experience"
        id="export-experience"
        label="Export experience"
        required="Select export experience"
        hint="Your customer will be asked to confirm this information."
        field={FieldTypeahead}
        resource={ExportExperienceResource}
      />
    </Step>
  )
}

export default CustomerDetailsStep
