import React from 'react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import ExportExperience from '../../../components/Resource/ExportExperience'
import BusinessPotential from '../../../components/Resource/BusinessPotential'
import CompanyContacts from '../../../components/Resource/CompanyContacts' // Refactor to CompanyContacts.FieldTypeahead
import WinUKRegions from '../../../components/Resource/WinUKRegions'

import { Step, FieldTypeahead } from '../../../components'
import { idNamesToValueLabels } from '../../../utils'
import { StyledHintParagraph } from './styled'
import { steps } from './constants'

const FieldTypeaheadMarginBottom = styled(FieldTypeahead)({
  marginBottom: 0,
})

const FieldTypeaheadMarginTop = styled(WinUKRegions.FieldTypeahead)({
  marginTop: 35,
})

const CustomerDetailsStep = ({ companyId, isEditing }) => (
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
    <StyledHintParagraph data-test="contact-hint">
      To select a customer contact name, it must have already been added to Data
      Hub. If not listed, go to the company page to add them.
    </StyledHintParagraph>
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

export default CustomerDetailsStep
