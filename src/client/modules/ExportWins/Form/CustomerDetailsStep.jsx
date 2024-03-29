import React from 'react'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { Step, FieldTypeahead } from '../../../components'
import { idNamesToValueLabels } from '../../../utils'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'
import {
  CompanyContactsResource,
  ExportExperienceResource,
  BusinessPotentialResource,
  WinUKRegions,
} from '../../../components/Resource'

const CustomerDetailsStep = ({ companyId, isEditing }) => {
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
        resource={CompanyContactsResource}
        field={FieldTypeahead}
        autoScroll={true}
        resultToOptions={({ results }) =>
          results.map(({ id, name, email }) => ({
            value: id,
            label: name,
            email,
          }))
        }
      />
      <StyledHintParagraph data-test="contact-hint">
        To select a customer contact name, it must have already been added to
        Data Hub. If not listed, go to the company page to add them.
      </StyledHintParagraph>
      <WinUKRegions.FieldTypeahead
        name="customer_location"
        id="customer-location"
        label="HQ location"
        required="Select HQ location"
        resultToOptions={(result) =>
          idNamesToValueLabels(result.filter(({ name }) => name !== 'All'))
        }
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
      {!isEditing && (
        <ResourceOptionsField
          name="export_experience"
          id="export-experience"
          label="Export experience"
          required="Select export experience"
          hint="Your customer will be asked to confirm this information."
          field={FieldTypeahead}
          resource={ExportExperienceResource}
        />
      )}
    </Step>
  )
}

export default CustomerDetailsStep
