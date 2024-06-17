import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isNull } from 'lodash'

import {
  FieldInput,
  FieldRadios,
  FieldWrapper,
  Step,
} from '../../../../components'
import { InvestmentTypesResource } from '../../../../components/Resource'
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
import {
  transformObjectForTypeahead,
  transformArrayForTypeahead,
  transformRadioOptionToBool,
} from '../transformers'
import { transformDateStringToDateObject } from '../../../../../apps/transformers'
import { OPTION_NO, OPTION_YES } from '../../../../../common/constants'
import { GREY_2 } from '../../../../utils/colours'
import { FDI_TYPES, INVESTMENT_PROJECT_STAGES_TO_ASSIGN_PM } from '../constants'

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

const EditProjectSummaryInitialStep = ({
  project,
  currentAdviserId,
  setSelectedFDIType,
  selectedFDIType,
  autoScroll,
  backButton,
  cancelUrl,
}) => {
  const showInvestorTypeField = () => {
    const isProjectFDITypeExpansion =
      project.fdiType?.id === FDI_TYPES.expansionOfExistingSiteOrActivity.value
    const isChangingToFDITypeExpansion =
      selectedFDIType?.value ===
      FDI_TYPES.expansionOfExistingSiteOrActivity.value
    if (isProjectFDITypeExpansion) {
      if (isNull(selectedFDIType) || isChangingToFDITypeExpansion) {
        // FDI type is remaining expansion
        return false
      } else {
        // FDI type is changing from expansion to other
        project.investorType = null
        return true
      }
    }
    if (isChangingToFDITypeExpansion) {
      // FDI type is changing from other to expansion
      return false
    }
    // FDI type is not expansion, nor changing to expansion
    return true
  }
  return (
    <Step name="initial-step" backButton={backButton} cancelUrl={cancelUrl}>
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
                      onChange={(newValue) => {
                        // TODO: investigate why newValue is an array
                        setSelectedFDIType(newValue[0])
                      }}
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
          initialValue={transformArrayForTypeahead(project.businessActivities)}
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
        marketingInitialValue={project.referralSourceActivityMarketing?.id}
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
        initialValue={transformObjectForTypeahead(project.likelihoodToLand)}
      />
      <FieldActualLandDate
        initialValue={transformDateStringToDateObject(project.actualLandDate)}
      />
      {showInvestorTypeField() ? (
        <FieldInvestmentInvestorType
          label="New or existing investor"
          initialValue={project.investorType?.id}
          optionalText={INVESTMENT_PROJECT_STAGES_TO_ASSIGN_PM.includes(
            project.stage.name
          )}
        />
      ) : null}
      <FieldLevelOfInvolvement
        initialValue={transformObjectForTypeahead(project.levelOfInvolvement)}
      />
      <FieldSpecificProgramme
        initialValue={transformObjectForTypeahead(project.specificProgramme)}
        optionalText={INVESTMENT_PROJECT_STAGES_TO_ASSIGN_PM.includes(
          project.stage.name
        )}
      />
    </Step>
  )
}

EditProjectSummaryInitialStep.propTypes = {
  project: PropTypes.object.isRequired,
  currentAdviserId: PropTypes.string.isRequired,
  setSelectedFDIType: PropTypes.func.isRequired,
  backButton: PropTypes.string.isRequired,
  cancelUrl: PropTypes.string.isRequired,
}

export default EditProjectSummaryInitialStep
