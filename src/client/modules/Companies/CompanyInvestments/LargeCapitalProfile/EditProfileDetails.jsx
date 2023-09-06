import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldTypeahead,
  FieldTextarea,
  FieldRadios,
  Form,
  FormLayout,
  FieldCurrency,
} from '../../../../components'
import {
  InvestorTypesResource,
  RequiredChecksConductedResource,
} from '../../../../components/Resource'
import { getReturnLink, transformInvestorDetailsToApi } from './transformers'
import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../../../transformers'

import { InvestorCheckDetails } from './InvestorCheckDetails'
import { TASK_UPDATE_LARGE_CAPITAL_PROFILE } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'

const InvestorDescriptionHint = () => (
  <>
    <span>Enter any additional relevant information.</span>
    <br />
    <span>For instance when founded, ownership, purpose and strategy.</span>
  </>
)

const buildInvestorCheckOptions = (
  options,
  requiredChecksConductedOn,
  requiredChecksConductedBy
) => {
  const transformedOptions = [
    {
      label: options[0].name,
      value: options[0].id,
      children: (
        <InvestorCheckDetails
          date={requiredChecksConductedOn}
          adviser={requiredChecksConductedBy}
        />
      ),
    },
    {
      label: options[1].name,
      value: options[1].id,
      children: (
        <InvestorCheckDetails
          date={requiredChecksConductedOn}
          adviser={requiredChecksConductedBy}
        />
      ),
    },
    {
      label: options[2].name,
      value: options[2].id,
    },
    {
      label: options[3].name,
      value: options[3].id,
    },
  ]
  return transformedOptions
}

const EditProfileDetails = ({ profile }) => {
  const {
    id: profileId,
    globalAssetsUnderManagement,
    investableCapital,
    investorCompany,
    investorDescription,
    investorType,
    requiredChecksConducted,
    requiredChecksConductedOn,
    requiredChecksConductedBy,
  } = profile

  return (
    <RequiredChecksConductedResource>
      {(requiredCheckOptions) => (
        <InvestorTypesResource>
          {(investorTypeOptions) => (
            <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
              <Form
                id="edit-large-capital-investor-details"
                analyticsFormName="editLargeCapitalInvestorDetails"
                cancelButtonLabel="Return without saving"
                cancelRedirectTo={() => getReturnLink(investorCompany.id)}
                flashMessage={() => 'Investor details changes saved'}
                submitButtonLabel="Save and return"
                submissionTaskName={TASK_UPDATE_LARGE_CAPITAL_PROFILE}
                redirectTo={() => getReturnLink(investorCompany.id)}
                transformPayload={(values) =>
                  transformInvestorDetailsToApi({
                    profileId,
                    companyId: investorCompany.id,
                    values,
                  })
                }
              >
                {() => (
                  <>
                    <FieldTypeahead
                      name="investor_type"
                      label="Investor type"
                      initialValue={transformIdNameToValueLabel(investorType)}
                      options={transformArrayIdNameToValueLabel(
                        investorTypeOptions
                      )}
                      placeholder="Please select an investor type"
                      aria-label="Select an investor type"
                    />
                    <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
                      <FieldCurrency
                        name="global_assets_under_management"
                        label="Global assets under management"
                        hint="Enter value in US dollars"
                        currencySymbol="$"
                        initialValue={globalAssetsUnderManagement}
                        type="text"
                      />
                      <FieldCurrency
                        name="investable_capital"
                        label="Investable capital"
                        hint="Enter value in US dollars"
                        currencySymbol="$"
                        initialValue={investableCapital}
                        type="text"
                      />
                    </FormLayout>
                    <FieldTextarea
                      name="investor_notes"
                      label="Investor description"
                      initialValue={investorDescription}
                      type="text"
                      hint={<InvestorDescriptionHint />}
                    />
                    <FieldRadios
                      legend="Has this investor cleared the required checks within the last 12 months?"
                      name="required_checks"
                      initialValue={requiredChecksConducted?.id}
                      options={buildInvestorCheckOptions(
                        requiredCheckOptions,
                        requiredChecksConductedOn,
                        requiredChecksConductedBy
                      )}
                    />
                  </>
                )}
              </Form>
            </FormLayout>
          )}
        </InvestorTypesResource>
      )}
    </RequiredChecksConductedResource>
  )
}

EditProfileDetails.propTypes = {
  profile: PropTypes.object.isRequired,
}

export default EditProfileDetails
