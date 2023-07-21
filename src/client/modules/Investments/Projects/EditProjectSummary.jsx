import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'

import {
  FieldInput,
  FieldRadios,
  FieldWrapper,
  Form,
  Main,
} from '../../../components'
import {
  InvestmentResource,
  InvestmentTypesResource,
} from '../../../components/Resource'
import {
  FieldActualLandDate,
  FieldAnonDescription,
  FieldBusinessActivity,
  FieldClientContacts,
  FieldEstimatedLandDate,
  FieldFDIType,
  FieldInvestmentInvestorType,
  FieldLevelOfInvolvement,
  FieldLikelihoodOfLanding,
  FieldProjectDescription,
  FieldProjectName,
  FieldProjectSector,
  FieldReferralSourceAdviser,
  FieldReferralSourceHierarchy,
  FieldSpecificProgramme,
} from './InvestmentFormFields'
import urls from '../../../../lib/urls'
import { transformObjectForTypeahead } from '../../../../apps/investments/client/projects/team/transformers'
import { transformArrayForTypeahead } from './transformers'
import { transformDateStringToDateObject } from '../../../../apps/transformers'
import { OPTION_NO, OPTION_YES } from '../../../../apps/constants'
import { GREY_2 } from '../../../utils/colours'
import { TASK_EDIT_INVESTMENT_PROJECT_SUMMARY } from './state'
import { transformProjectSummaryForApi } from './transformers'

const StyledFieldWrapper = styled(FieldWrapper)`
  border: 1px solid ${GREY_2};
  border-radius: 5px;
  padding: 16px 16px;
`

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
              <FieldBusinessActivity
                initialValue={transformArrayForTypeahead(
                  project.businessActivities
                )}
              />
              <FieldInput
                label="Other business activity (if not on list)"
                name="other_business_activity"
                type="text"
                initialValue={project.otherBusinessActivity}
                placeholder="e.g. meet and greet dinner"
              />
            </StyledFieldWrapper>
            <FieldClientContacts
              companyId={project.investorCompany.id}
              initialValue={transformArrayForTypeahead(project.clientContacts)}
            />
            <FieldReferralSourceAdviser
              name="is_referral_source"
              initialValue={
                checkReferralSourceAdviser(
                  currentAdviser,
                  project.referralSourceAdviser.id
                )
                  ? OPTION_YES
                  : OPTION_NO
              }
              label="Referral source adviser"
              typeaheadInitialValue={
                checkReferralSourceAdviser(
                  currentAdviser,
                  project.referralSourceAdviser.id
                )
                  ? null
                  : transformObjectForTypeahead(project.referralSourceAdviser)
              }
            />
            <FieldReferralSourceHierarchy
              initialValue={project.referralSourceActivity?.id}
              marketingInitialValue={
                project.referralSourceActivityMarketing?.id
              }
              websiteInitialValue={project.referralSourceActivityWebsite?.id}
              eventInitialValue={project.referralSourceActivityEvent}
              eventPlaceholder="e.g. conversation at conference"
            />
            <FieldEstimatedLandDate
              initialValue={transformDateStringToDateObject(
                project.estimatedLandDate
              )}
            />
            <FieldLikelihoodOfLanding
              initialValue={transformObjectForTypeahead(
                project.likelihoodToLand
              )}
            />
            <FieldActualLandDate
              initialValue={transformDateStringToDateObject(
                project.actualLandDate
              )}
            />
            <FieldInvestmentInvestorType
              label="New or existing investor"
              initialValue={project.investorType?.id}
            />
            <FieldLevelOfInvolvement
              initialValue={transformObjectForTypeahead(
                project.levelOfInvolvement
              )}
            />
            <FieldSpecificProgramme
              initialValue={transformObjectForTypeahead(
                project.specificProgramme
              )}
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
