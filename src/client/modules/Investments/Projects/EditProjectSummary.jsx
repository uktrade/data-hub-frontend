import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE, SPACING, SPACING_POINTS } from '@govuk-react/constants'
import styled from 'styled-components'

import {
  FieldAdvisersTypeahead,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTypeahead,
  FieldWrapper,
  Form,
  Main,
} from '../../../components'
import {
  BusinessActivitiesResourse,
  CompanyContactsResource,
  InvestmentResource,
  InvestmentInvestorTypesResource,
  InvestmentTypesResource,
  LevelOfInvolvementResource,
  LikelihoodToLandResource,
  ReferralSourceActivityResource,
  ReferralSourceMarketingResource,
  ReferralSourceWebsiteResource,
  SpecificInvestmentProgrammesResource,
} from '../../../components/Resource'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import urls from '../../../../lib/urls'
import { transformObjectForTypeahead } from '../../../../apps/investments/client/projects/team/transformers'
import { transformArrayForTypeahead } from './transformers'
import { transformDateStringToDateObject } from '../../../../apps/transformers'
import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../apps/constants'
import { GREY_2 } from '../../../utils/colours'
import { TASK_EDIT_INVESTMENT_PROJECT_SUMMARY } from './state'
import { transformProjectSummaryForApi } from './transformers'
import {
  FieldFDIType,
  FieldProjectName,
  FieldProjectDescription,
  FieldAnonDescription,
  FieldProjectSector,
} from './InvestmentFormFields'

const StyledFieldWrapper = styled(FieldWrapper)`
  border: 1px solid ${GREY_2};
  border-radius: 5px;
  padding: 16px 16px;
`

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

const checkReferralSourceAdviser = (currentAdviser, referralSourceAdviser) =>
  currentAdviser === referralSourceAdviser

const EditProjectSummary = ({ projectId, currentAdviser }) => (
  <InvestmentResource id={projectId}>
    {(project) => (
      <>
        <H2 size={LEVEL_SIZE[3]}>Update investment project summary</H2>
        <Main>
          <Form
            id="edit-project-summary"
            analyticsFormName="editInvestmentProjectSummary"
            cancelButtonLabel="Back"
            cancelRedirectTo={() =>
              urls.investments.projects.details(project.id)
            }
            flashMessage={() => 'Investment details updated'}
            submitButtonlabel="Save"
            redirectTo={() => urls.investments.projects.details(project.id)}
            submissionTaskName={TASK_EDIT_INVESTMENT_PROJECT_SUMMARY}
            transformPayload={(values) =>
              transformProjectSummaryForApi({
                projectId,
                currentAdviser,
                values,
              })
            }
          >
            <FieldProjectName initialValue={project.name} />
            <FieldProjectDescription initialValue={project.description} />
            <FieldAnonDescription initialValue={project.anonymousDescription} />
            <InvestmentTypesResource>
              {(investmentTypes) => (
                <FieldRadios
                  name="investment_type"
                  label="Investment type"
                  initialValue={project.investmentType.id}
                  options={transformArrayForTypeahead(investmentTypes).map(
                    (option) => ({
                      ...option,
                      ...(option.label === 'FDI' && {
                        children: (
                          <FieldFDIType
                            initialValue={transformObjectForTypeahead(
                              project.fdiType
                            )}
                          />
                        ),
                      }),
                    })
                  )}
                />
              )}
            </InvestmentTypesResource>
            <FieldProjectSector
              initialValue={transformObjectForTypeahead(project.sector)}
            />
            <StyledFieldWrapper name="businessActivitiesWrapper">
              <ResourceOptionsField
                name="business_activities"
                label="Business activities"
                resource={BusinessActivitiesResourse}
                field={FieldTypeahead}
                initialValue={transformArrayForTypeahead(
                  project.businessActivities
                )}
                isMulti={true}
                placeholder="Choose a business activity"
              />
              <FieldInput
                label="Other business activity (if not on list)"
                name="other_business_activity"
                type="text"
                initialValue={project.otherBusinessActivity}
                placeholder="e.g. meet and greet dinner"
              />
            </StyledFieldWrapper>
            <ResourceOptionsField
              name="client_contacts"
              label="Client contacts"
              resource={CompanyContactsResource}
              id={project.investorCompany.id}
              field={FieldTypeahead}
              resultToOptions={({ results }) =>
                transformArrayForTypeahead(results)
              }
              initialValue={transformArrayForTypeahead(project.clientContacts)}
              isMulti={true}
              placeholder="Choose the client contacts"
            />
            <FieldRadios
              name="is_referral_source"
              label="Are you the referral source for this project?"
              initialValue={
                checkReferralSourceAdviser(
                  currentAdviser,
                  project.referralSourceAdviser.id
                )
                  ? OPTION_YES
                  : OPTION_NO
              }
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
                ...(option.value === OPTION_NO && {
                  children: (
                    <FieldAdvisersTypeahead
                      name="referral_source_adviser"
                      label="Referral source adviser"
                      initialValue={
                        checkReferralSourceAdviser(
                          currentAdviser,
                          project.referralSourceAdviser.id
                        )
                          ? null
                          : transformObjectForTypeahead(
                              project.referralSourceAdviser
                            )
                      }
                      placeholder="Select referral source adviser"
                      required="Select the referral source adviser"
                    />
                  ),
                }),
              }))}
            />
            <ReferralSourceActivityResource>
              {(referralSourceActivities) => (
                <StyledReferralSourceWrapper>
                  <FieldSelect
                    name="referral_source_activity"
                    label="Referral source activity"
                    initialValue={project.referralSourceActivity?.id}
                    options={transformArrayForTypeahead(
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
                              initialValue={
                                project.referralSourceActivityMarketing?.id
                              }
                              placeholder="Choose a marketing type"
                              required="Select the marketing type"
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
                              initialValue={
                                project.referralSourceActivityWebsite?.id
                              }
                              placeholder="Choose a website"
                              required="Select the website"
                            />
                          </StyledContainer>
                        ),
                      }),
                      ...(option.label === 'Event' && {
                        children: (
                          <StyledContainer>
                            <FieldInput
                              label="Event"
                              name="referral_source_activity_event"
                              type="text"
                              initialValue={project.referralSourceActivityEvent}
                              placeholder="e.g. conversation at conference"
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
            <FieldDate
              name="estimated_land_date"
              label="Estimated land date"
              initialValue={transformDateStringToDateObject(
                project.estimatedLandDate
              )}
              hint="When activities planned under the investment project will have fully commenced"
              showDay={false}
              required="Enter the project's estimated land date"
            />
            <ResourceOptionsField
              name="likelihood_to_land"
              label="Likelihood of landing"
              resource={LikelihoodToLandResource}
              field={FieldTypeahead}
              initialValue={transformObjectForTypeahead(
                project.likelihoodToLand
              )}
              placeholder="Select a likelihood of landing value"
            />
            <FieldDate
              name="actual_land_date"
              label="Actual land date"
              initialValue={transformDateStringToDateObject(
                project.actualLandDate
              )}
              hint="When activities under the investment project fully commenced"
            />
            <ResourceOptionsField
              name="investor_type"
              label="New or existing investor"
              resource={InvestmentInvestorTypesResource}
              field={FieldRadios}
              initialValue={project.investorType?.id}
            />
            <ResourceOptionsField
              name="level_of_involvement"
              label="Investor level of involvement"
              resource={LevelOfInvolvementResource}
              field={FieldTypeahead}
              initialValue={transformObjectForTypeahead(
                project.levelOfInvolvement
              )}
              placeholder="Choose a level of involvement"
            />
            <ResourceOptionsField
              name="specific_programme"
              label="Specific investment programme"
              resource={SpecificInvestmentProgrammesResource}
              field={FieldTypeahead}
              initialValue={transformObjectForTypeahead(
                project.specificProgramme
              )}
              placeholder="Choose a specific programme"
            />
          </Form>
        </Main>
      </>
    )}
  </InvestmentResource>
)
EditProjectSummary.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default EditProjectSummary
