import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldCheckboxes,
  FieldRadios,
  Form,
  Main,
} from '../../../../components'
import {
  ConstructionRisksResource,
  DealTicketSizesResource,
  DesiredDealRolesResource,
  LargeCapitalInvestmentEquityPercentagesResource,
  LargeCapitalInvestmentRestrictionsResource,
  LargeCapitalInvestmentReturnRateResource,
  LargeCapitalInvestmentTypesResource,
  TimeHorizonsResource,
} from '../../../../components/Resource'
import ResourceOptionsField from '../../../../components/Form/elements/ResourceOptionsField'
import { transformArrayIdNameToValueLabel } from '../../../../transformers'
import {
  getReturnLink,
  transformInitialValuesForCheckbox,
  transformInvestorRequirementsToApi,
} from './transformers'
import { FieldAssetClassTypeahead } from '../../../../components/Form/elements/AssetClassOptions'
import { TASK_UPDATE_LARGE_CAPITAL_PROFILE } from './state'

const EditRequirementsForm = ({ profile }) => {
  const {
    id: profileId,
    investorCompany,
    assetClassesOfInterest,
    constructionRisks,
    dealTicketSizes,
    desiredDealRoles,
    investmentTypes,
    minimumEquityPercentage,
    minimumReturnRate,
    restrictions,
    timeHorizons,
  } = profile

  return (
    <Main>
      <Form
        id="edit-large-capital-profile-requirements"
        analyticsFormName="editLargeCapitalProfileRequirements"
        cancelButtonLabel="Return without saving"
        cancelRedirectTo={() => getReturnLink(investorCompany.id)}
        flashMessage={() => 'Investor requirement changes saved'}
        submitButtonlabel="Save and return"
        submissionTaskName={TASK_UPDATE_LARGE_CAPITAL_PROFILE}
        redirectTo={() => getReturnLink(investorCompany.id)}
        transformPayload={(values) =>
          transformInvestorRequirementsToApi({
            profileId,
            companyId: investorCompany.id,
            values,
          })
        }
      >
        <ResourceOptionsField
          name="deal_ticket_size"
          label="Deal ticket size"
          resource={DealTicketSizesResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(dealTicketSizes)}
        />
        <FieldAssetClassTypeahead
          isMulti={true}
          name="asset_classes"
          initialValue={transformArrayIdNameToValueLabel(
            assetClassesOfInterest
          )}
        />
        <p>
          If the asset class you wish to select is not shown above, then request
          it from&nbsp;
          <a href={`mailto:capitalinvestment@trade.gov.uk`}>
            capitalinvestment@trade.gov.uk
          </a>
          .
        </p>
        <ResourceOptionsField
          name="investment_types"
          label="Types of investment"
          resource={LargeCapitalInvestmentTypesResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(investmentTypes)}
        />
        <ResourceOptionsField
          name="minimum_return_rate"
          label="Minimum return rate"
          resource={LargeCapitalInvestmentReturnRateResource}
          field={FieldRadios}
          initialValue={minimumReturnRate ? minimumReturnRate.id : null}
        />
        <ResourceOptionsField
          name="time_horizons"
          label="Time horizon / tenor"
          resource={TimeHorizonsResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(timeHorizons)}
        />
        <ResourceOptionsField
          name="restrictions"
          label="Restrictions / conditions"
          resource={LargeCapitalInvestmentRestrictionsResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(restrictions)}
        />
        <ResourceOptionsField
          name="construction_risk"
          label="Construction risk"
          resource={ConstructionRisksResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(constructionRisks)}
        />
        <ResourceOptionsField
          name="minimum_equity_percentage"
          label="Minimum equity percentage"
          resource={LargeCapitalInvestmentEquityPercentagesResource}
          field={FieldRadios}
          initialValue={
            minimumEquityPercentage ? minimumEquityPercentage.id : null
          }
        />
        <ResourceOptionsField
          name="desired_deal_role"
          label="Desired deal role"
          resource={DesiredDealRolesResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(desiredDealRoles)}
        />
      </Form>
    </Main>
  )
}
EditRequirementsForm.propTypes = {
  profile: PropTypes.object.isRequired,
}

export default EditRequirementsForm
