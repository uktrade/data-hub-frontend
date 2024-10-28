/**
 * Fields shared by the add/edit investment project forms
 */

import React from 'react'
import styled from 'styled-components'
import { SPACING, SPACING_POINTS } from '@govuk-react/constants'

import {
  FieldAdvisersTypeahead,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTextarea,
  FieldTypeahead,
} from '../../../components'
import {
  BusinessActivitiesResource,
  CompanyContactsResource,
  FDITypesResource,
  InvestmentInvestorTypesResource,
  LevelOfInvolvementResource,
  LikelihoodToLandResource,
  ReferralSourceActivityResource,
  ReferralSourceMarketingResource,
  ReferralSourceWebsiteResource,
  SectorResource,
  SpecificInvestmentProgrammesResource,
} from '../../../components/Resource'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import {
  transformArrayForTypeahead,
  transformAndFilterArrayForTypeahead,
} from './transformers'
import { GREY_2 } from '../../../utils/colours'
import { OPTIONS_YES_NO, OPTION_NO } from '../../../../common/constants'
import { idNamesToValueLabels } from '../../../utils'
import { validateIfDateInPast } from '../../../components/Form/validators'
import { FDI_TYPES } from './constants'
import {
  isFieldOptionalForStageLabel,
  validateFieldForStage,
} from './validators'

const StyledReferralSourceWrapper = styled.div`
  margin-bottom: ${SPACING_POINTS[6]}px;
`

const StyledContainer = styled.div(({ error }) => ({
  paddingLeft: SPACING.SCALE_4,
  marginLeft: SPACING.SCALE_4,
  marginTop: SPACING.SCALE_2,
  ...(error
    ? { marginLeft: 0 }
    : {
        borderLeft: `${SPACING.SCALE_1} solid ${GREY_2}`,
        marginLeft: SPACING.SCALE_4,
      }),
}))

const StyledFieldInput = styled(FieldInput)({
  width: '100%',
})

export const FieldFDIType = ({ initialValue = null, onChange = null }) => {
  /*
  The result of this modified transformer is:
  only the field state will contain the additional text
  i.e. selectedFDIType.label === FDI_TYPES.capitalOnly.labelWithHintText;
  the project attribute and other data populated directly from the API will remain unchanged
  i.e. project.fdiType.name === FDI_TYPES.capitalOnly.label.
  In both cases, its recommended to compare the fdiType id/value attribute instead
  */
  const fdiTypeIdNamesToValueLabels = (result) => {
    return result.map((option) => {
      return {
        value: option.id,
        label:
          option.id === FDI_TYPES.capitalOnly.value
            ? FDI_TYPES.capitalOnly.labelWithHintText
            : option.name,
      }
    })
  }
  return (
    <ResourceOptionsField
      name="fdi_type"
      label="Type of Foreign Direct Investment (FDI)"
      resource={FDITypesResource}
      resultToOptions={fdiTypeIdNamesToValueLabels}
      field={FieldTypeahead}
      initialValue={initialValue}
      placeholder="Select an FDI type"
      required="Select the FDI type"
      onChange={onChange}
    />
  )
}

export const FieldProjectName = ({ initialValue = '', placeholder = null }) => (
  <FieldInput
    label="Project name"
    name="name"
    type="text"
    initialValue={initialValue || ''}
    required="Enter a project name"
    placeholder={placeholder}
  />
)

export const FieldProjectDescription = ({ initialValue = '', hint = null }) => (
  <FieldTextarea
    type="text"
    name="description"
    label="Project description"
    required="Enter a project description"
    initialValue={initialValue || ''}
    hint={hint}
  />
)

export const FieldAnonDescription = ({ initialValue = '' }) => (
  <FieldTextarea
    type="text"
    name="anonymous_description"
    label="Anonymous project details (optional)"
    hint="Do not include company names, financial details or addresses"
    initialValue={initialValue || ''}
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
    required="Choose a primary sector"
  />
)

export const FieldBusinessActivity = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="business_activities"
    label="Business activities"
    resource={BusinessActivitiesResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    isMulti={true}
    placeholder="Choose a business activity"
    required="Choose a business activity"
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

export const FieldReferralSourceHierarchy = ({
  initialValue = null,
  marketingInitialValue = null,
  websiteInitialValue = null,
  eventInitialValue = null,
  eventPlaceholder = '',
}) => (
  <ReferralSourceActivityResource>
    {(referralSourceActivities) => (
      <StyledReferralSourceWrapper>
        <FieldSelect
          name="referral_source_activity"
          label="Referral source activity"
          emptyOption="Choose a referral source activity"
          required="Choose a referral source activity"
          initialValue={initialValue}
          fullWidth={true}
          options={transformAndFilterArrayForTypeahead(
            referralSourceActivities
          ).map((option) => ({
            ...option,
            ...(option.label === 'Marketing' && {
              children: (
                <StyledContainer>
                  <ResourceOptionsField
                    name="referral_source_activity_marketing"
                    label="Marketing"
                    resource={ReferralSourceMarketingResource}
                    field={FieldSelect}
                    initialValue={marketingInitialValue}
                    placeholder="Choose a marketing type"
                    required="Choose the marketing type"
                    fullWidth={true}
                  />
                </StyledContainer>
              ),
            }),
            ...(option.label === 'Website' && {
              children: (
                <StyledContainer>
                  <ResourceOptionsField
                    name="referral_source_activity_website"
                    label="Website"
                    resource={ReferralSourceWebsiteResource}
                    field={FieldSelect}
                    initialValue={websiteInitialValue}
                    placeholder="Choose a website"
                    required="Choose the website"
                    fullWidth={true}
                  />
                </StyledContainer>
              ),
            }),
            ...(option.label === 'Event' && {
              children: (
                <StyledContainer>
                  <StyledFieldInput
                    label="Event"
                    name="referral_source_activity_event"
                    type="text"
                    initialValue={eventInitialValue || ''}
                    placeholder={eventPlaceholder}
                    required="Enter the event details"
                  />
                </StyledContainer>
              ),
            }),
          }))}
        />
      </StyledReferralSourceWrapper>
    )}
  </ReferralSourceActivityResource>
)

export const FieldEstimatedLandDate = ({ initialValue = null }) => (
  <FieldDate
    format="short"
    name="estimated_land_date"
    label="Estimated land date"
    hint="An estimated date of when investment project activities will start"
    required="Enter an estimated land date"
    invalid="Enter a valid estimated land date"
    initialValue={initialValue}
  />
)

export const FieldLikelihoodOfLanding = ({
  initialValue = null,
  autoScroll,
  project,
}) => (
  <ResourceOptionsField
    name="likelihood_to_land"
    label={
      'Likelihood of landing' +
      isFieldOptionalForStageLabel('likelihood_to_land', project)
    }
    resource={LikelihoodToLandResource}
    field={FieldTypeahead}
    placeholder="Select a likelihood of landing value"
    initialValue={initialValue}
    autoScroll={autoScroll}
    validate={(values, field, formFields) => {
      return validateFieldForStage(
        field,
        formFields,
        project,
        'Select a likelihood of landing value'
      )
    }}
  />
)

export const FieldActualLandDate = ({ initialValue = null, project }) => (
  <FieldDate
    name="actual_land_date"
    label={
      'Actual land date' +
      isFieldOptionalForStageLabel('actual_land_date', project)
    }
    hint="The date investment project activities started"
    invalid="Enter a valid actual land date"
    initialValue={initialValue}
    validate={(values, field, formFields) => {
      let result = validateIfDateInPast(values)
      if (!result) {
        result = validateFieldForStage(
          field,
          formFields,
          project,
          'Select a likelihood of landing value'
        )
      }
      return result
    }}
  />
)

export const FieldInvestmentInvestorType = ({
  label,
  initialValue = null,
  project,
}) => (
  <ResourceOptionsField
    name="investor_type"
    label={label + isFieldOptionalForStageLabel('investor_type', project)}
    resource={InvestmentInvestorTypesResource}
    field={FieldRadios}
    initialValue={initialValue}
    placeholder="Choose an investor type"
    validate={(values, field, formFields) => {
      return validateFieldForStage(
        field,
        formFields,
        project,
        'Select an investor type'
      )
    }}
  />
)

export const FieldLevelOfInvolvement = ({ initialValue = null, project }) => (
  <ResourceOptionsField
    name="level_of_involvement"
    label={
      'Level of investor involvement' +
      isFieldOptionalForStageLabel('level_of_involvement', project)
    }
    resource={LevelOfInvolvementResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    placeholder="Choose a level of involvement"
    validate={(values, field, formFields) => {
      return validateFieldForStage(
        field,
        formFields,
        project,
        'Select a level of involvement'
      )
    }}
  />
)

export const FieldSpecificProgramme = ({ initialValue = null, project }) => (
  <ResourceOptionsField
    name="specific_programmes"
    label={
      'Specific investment programme' +
      isFieldOptionalForStageLabel('specific_programmes', project)
    }
    resource={SpecificInvestmentProgrammesResource}
    field={FieldTypeahead}
    isMulti={false}
    initialValue={initialValue}
    placeholder="Choose a specific programme"
    resultToOptions={(result) =>
      idNamesToValueLabels(result.filter((option) => !option.disabledOn))
    }
    validate={(values, field, formFields) => {
      return validateFieldForStage(
        field,
        formFields,
        project,
        'Select a specific programme'
      )
    }}
  />
)
