import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../lib/urls'
import {
  FieldTypeahead,
  FieldTextarea,
  FieldRadios,
  Form,
  FormLayout,
  FieldCurrency,
} from '../../../../components'
import InvestorTypesResource from '../../../../components/Resource/InvestorTypes'
import RequiredChecksConducted from '../../../../components/Resource/RequiredChecksConducted'
import { transformInvestorDetailsToApi } from './transformers'
import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../../../transformers'

import { InvestorCheckDetails } from './InvestorCheckDetails'
import { TASK_SAVE_LARGE_CAPITAL_INVESTOR_DETAILS } from './state'
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

const EditLargeCapitalInvestorDetails = ({
  profileId,
  companyId,
  investorDetails,
}) => {
  const {
    globalAssetsUnderManagement,
    investableCapital,
    investorDescription,
    investorType,
    requiredChecksConducted,
    requiredChecksConductedOn,
    requiredChecksConductedBy,
  } = investorDetails

  return (
    <RequiredChecksConducted>
      {(requiredCheckOptions) => (
        <InvestorTypesResource>
          {(investorTypeOptions) => (
            <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
              <Form
                id="edit-large-capital-investor-details"
                analyticsFormName="editLargeCapitalInvestorDetails"
                cancelButtonLabel="Return without saving"
                cancelRedirectTo={() =>
                  urls.companies.investments.largeCapitalProfile(companyId)
                }
                flashMessage={() => 'Investor details changes saved'}
                submitButtonLabel="Save and return"
                submissionTaskName={TASK_SAVE_LARGE_CAPITAL_INVESTOR_DETAILS}
                redirectTo={() =>
                  urls.companies.investments.largeCapitalProfile(companyId)
                }
                transformPayload={(values) =>
                  transformInvestorDetailsToApi({
                    profileId,
                    companyId,
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
                      arial-label="Select an investor type"
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
    </RequiredChecksConducted>
  )
}

const valueTextShape = PropTypes.shape({
  value: PropTypes.string,
  text: PropTypes.string,
})

EditLargeCapitalInvestorDetails.propTypes = {
  profileId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  investorDetails: PropTypes.shape({
    investorType: valueTextShape,
    globalAssetsUnderManagement: PropTypes.shape({
      value: PropTypes.number,
    }),
    investableCapital: PropTypes.shape({
      value: PropTypes.number,
    }),
    investorDescription: PropTypes.shape({
      value: PropTypes.string,
    }),
    requiredChecks: PropTypes.shape({
      cleared: valueTextShape,
      issuesIdentified: valueTextShape,
      notRequired: valueTextShape,
      notYetChecked: valueTextShape,
    }),
  }),
}

export default EditLargeCapitalInvestorDetails
