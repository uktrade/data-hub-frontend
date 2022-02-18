import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../../lib/urls'
import Form from '../../../../../../client/components/Form'
import {
  FieldTypeahead,
  FieldInput,
  FieldTextarea,
  FieldRadios,
} from '../../../../../../client/components'
import {
  transformIdNameToValueLabel,
  transformObjectToValueLabel,
  transformInvestorDetailsToApi,
} from './transformers'

import { InvestorCheckDetails } from './InvestorCheckDetails'
import { TASK_SAVE_LARGE_CAPITAL_INVESTOR_DETAILS } from './state'

const InvestorDescriptionHint = () => (
  <>
    <span>Enter any additional relevant information.</span>
    <br />
    <span>For instance when founded, ownership, purpose and strategy.</span>
  </>
)

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
    requiredChecks,
  } = investorDetails

  const OPTION_CLEARED = 'Cleared',
    OPTION_ISSUES_IDENTIFIED = 'Issues identified'

  const requiredChecksCheckedValue = Object.values(requiredChecks).find(
    (item) => item.checked === true
  )?.value

  return (
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
        transformInvestorDetailsToApi({ profileId, companyId, values })
      }
    >
      {() => (
        <>
          <FieldTypeahead
            name="investor_type"
            label="Investor type"
            initialValue={transformObjectToValueLabel(investorType)}
            options={transformIdNameToValueLabel(investorType?.items)}
            placeholder="Please select an investor type"
            arial-label="Select an investor type"
          />
          <FieldInput
            name="global_assets_under_management"
            label="Global assets under management"
            initialValue={globalAssetsUnderManagement?.value?.toString()}
            type="text"
            hint="Enter value in US dollars"
          />
          <FieldInput
            name="investable_capital"
            label="Investable capital"
            initialValue={investableCapital?.value?.toString()}
            type="text"
            hint="Enter value in US dollars"
          />
          <FieldTextarea
            name="investor_notes"
            label="Investor description"
            initialValue={investorDescription?.value}
            type="text"
            hint={<InvestorDescriptionHint />}
          />
          <FieldRadios
            legend="Has this investor cleared the required checks within the last 12 months?"
            name="required_checks"
            initialValue={requiredChecksCheckedValue}
            options={Object.values(requiredChecks).map((option) => ({
              label: option.text,
              value: option.value,
              ...((option.text === OPTION_CLEARED ||
                option.text === OPTION_ISSUES_IDENTIFIED) && {
                children: <InvestorCheckDetails {...option} />,
              }),
            }))}
            inline={false}
          />
        </>
      )}
    </Form>
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
