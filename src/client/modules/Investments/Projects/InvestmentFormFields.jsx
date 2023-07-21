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
  BusinessActivitiesResourse,
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
import { transformArrayForTypeahead } from './transformers'
import { GREY_2 } from '../../../utils/colours'
import { OPTIONS_YES_NO, OPTION_NO } from '../../../../apps/constants'

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
          initialValue={initialValue}
          fullWidth={true}
          options={transformArrayForTypeahead(referralSourceActivities).map(
            (option) => ({
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
                      required="Select the marketing type"
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
                      required="Select the website"
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
                      initialValue={eventInitialValue}
                      placeholder={eventPlaceholder}
                      required="Enter the event details"
                    />
                  </StyledContainer>
                ),
              }),
            })
          )}
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

export const FieldLikelihoodOfLanding = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="likelihood_to_land"
    label="Likelihood of landing (optional)"
    resource={LikelihoodToLandResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    placeholder="Select a likelihood of landing value"
  />
)

export const FieldActualLandDate = ({ initialValue = null }) => (
  <FieldDate
    name="actual_land_date"
    label="Actual land date (optional)"
    hint="The date investment project activities started"
    invalid="Enter a valid actual land date"
    initialValue={initialValue}
  />
)

export const FieldInvestmentInvestorType = ({ label, initialValue = null }) => (
  <ResourceOptionsField
    name="investor_type"
    label={label}
    resource={InvestmentInvestorTypesResource}
    field={FieldRadios}
    initialValue={initialValue}
  />
)

export const FieldLevelOfInvolvement = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="level_of_involvement"
    label="Level of investor involvement (optional)"
    resource={LevelOfInvolvementResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    placeholder="Choose a level of involvement"
  />
)

export const FieldSpecificProgramme = ({ initialValue = null }) => (
  <ResourceOptionsField
    name="specific_programme"
    label="Specific investment programme (optional)"
    resource={SpecificInvestmentProgrammesResource}
    field={FieldTypeahead}
    initialValue={initialValue}
    placeholder="Choose a specific programme"
  />
)
