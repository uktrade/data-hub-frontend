import React from 'react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import ExportExperience from '../../../components/Resource/ExportExperience'
import BusinessPotential from '../../../components/Resource/BusinessPotential'
import CompanyContacts from '../../../components/Resource/CompanyContacts' // Refactor to CompanyContacts.FieldTypeahead
import WinUKRegions from '../../../components/Resource/WinUKRegions'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step, FieldTypeahead, ContactInformation } from '../../../components'
import { idNamesToValueLabels } from '../../../utils'
import { steps } from './constants'
import Task from '../../../components/Task'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../components/ContactForm/state'
import { ID as STORE_ID } from './state'

const FieldTypeaheadMarginBottom = styled(FieldTypeahead)({
  paddingBottom: 8,
  marginBottom: 30,
})

const FieldTypeaheadMarginTop = styled(WinUKRegions.FieldTypeahead)({
  marginTop: 35,
})

const CustomerDetailsStep = ({ companyId, isEditing }) => {
  const { values } = useFormContext()
  return (
    <Step name={steps.CUSTOMER_DETAILS}>
      <H3 data-test="step-heading">Customer details</H3>
      <ResourceOptionsField
        name="company_contacts"
        id={companyId}
        label="Company contacts"
        hint="This contact will be emailed to approve the win."
        required="Select a company contact"
        placeholder="Select contact"
        resource={CompanyContacts}
        field={FieldTypeaheadMarginBottom}
        autoScroll={true}
        payload={{ archived: false }}
        resultToOptions={({ results }) =>
          results.map(({ id, name, email }) => ({
            value: id,
            label: name,
            email,
          }))
        }
      />
      <Task>
        {(getTask) => {
          const openContactFormTask = getTask(
            TASK_REDIRECT_TO_CONTACT_FORM,
            STORE_ID
          )

          return (
            <>
              <ContactInformation
                companyId={companyId}
                onOpenContactForm={({ redirectUrl }) => {
                  openContactFormTask.start({
                    payload: {
                      values: values,
                      url: redirectUrl,
                      storeId: STORE_ID,
                    },
                  })
                }}
              />
            </>
          )
        }}
      </Task>
      <FieldTypeaheadMarginTop
        name="customer_location"
        id="customer-location"
        label="HQ location"
        required="Select HQ location"
        resultToOptions={(result) =>
          idNamesToValueLabels(result.filter(({ name }) => name !== 'All'))
        }
        fullWidth={true}
      />
      <BusinessPotential.FieldChoice.Radio
        name="business_potential"
        id="business-potential"
        label="Medium-sized and high potential companies"
        required="Select medium-sized and high potential companies"
      />
      {!isEditing && (
        <ExportExperience.FieldTypeahead
          name="export_experience"
          id="export-experience"
          label="Export experience"
          required="Select export experience"
          hint="Your customer will be asked to confirm this information."
          resultToOptions={(result) =>
            idNamesToValueLabels(result.filter((option) => !option.disabledOn))
          }
        />
      )}
    </Step>
  )
}

export default CustomerDetailsStep
