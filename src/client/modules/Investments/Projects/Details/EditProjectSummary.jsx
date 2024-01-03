import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  FieldInput,
  FieldRadios,
  FieldWrapper,
  Form,
} from '../../../../components'
import {
  InvestmentResource,
  InvestmentTypesResource,
} from '../../../../components/Resource'
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
} from '../InvestmentFormFields'
import urls from '../../../../../lib/urls'
import {
  transformObjectForTypeahead,
  transformArrayForTypeahead,
  transformRadioOptionToBool,
} from '../transformers'
import { transformProjectSummaryForApi } from './transformers'
import { transformDateStringToDateObject } from '../../../../../apps/transformers'
import { OPTION_NO, OPTION_YES } from '../../../../../common/constants'
import { GREY_2 } from '../../../../utils/colours'
import { state2props, TASK_EDIT_INVESTMENT_PROJECT_SUMMARY } from './state'
import ProjectLayout from '../../../../components/Layout/ProjectLayout'

const StyledFieldWrapper = styled(FieldWrapper)`
  border: 1px solid ${GREY_2};
  border-radius: 5px;
  padding: 16px 16px;
`

const checkReferralSourceAdviserIsCurrentAdviser = (
  currentAdviser,
  referralSourceAdviser
) => (currentAdviser === referralSourceAdviser ? OPTION_YES : OPTION_NO)

const checkReferralSourceAdviser = (currentAdviser, referralSourceAdviser) =>
  referralSourceAdviser == null
    ? null
    : checkReferralSourceAdviserIsCurrentAdviser(
        currentAdviser,
        referralSourceAdviser
      )

const EditProjectSummary = ({ currentAdviserId, autoScroll }) => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <ProjectLayout
          project={project}
          breadcrumbs={[
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            { text: 'Edit details' },
          ]}
          pageTitle="Edit details"
        >
          <H2 size={LEVEL_SIZE[3]}>Update investment project summary</H2>
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
                currentAdviserId,
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
                initialValue={project.otherBusinessActivity || ''}
                placeholder="e.g. meet and greet dinner"
              />
            </StyledFieldWrapper>
            <FieldClientContacts
              companyId={project.investorCompany.id}
              initialValue={transformArrayForTypeahead(project.clientContacts)}
            />
            <FieldReferralSourceAdviser
              name="is_referral_source"
              initialValue={checkReferralSourceAdviser(
                currentAdviserId,
                project.referralSourceAdviser?.id
              )}
              label="Referral source adviser"
              typeaheadInitialValue={
                transformRadioOptionToBool(
                  checkReferralSourceAdviser(
                    currentAdviserId,
                    project.referralSourceAdviser?.id
                  )
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
              autoScroll={!!autoScroll}
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
        </ProjectLayout>
      )}
    </InvestmentResource>
  )
}

EditProjectSummary.propTypes = {
  currentAdviserId: PropTypes.string.isRequired,
}

export default connect(state2props)(EditProjectSummary)
