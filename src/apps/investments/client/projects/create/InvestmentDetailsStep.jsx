import React from 'react'
import PropTypes from 'prop-types'

import {
  Step,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldTypeahead,
  SummaryTable,
  ContactInformation,
  FormLayout,
} from '../../../../../client/components'
import { OPTION_NO, OPTIONS_YES_NO } from '../../../../constants'
import Task from '../../../../../client/components/Task'
import { CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../../../client/components/ContactForm/state'
import {
  FieldProjectName,
  FieldProjectDescription,
  FieldAnonDescription,
  FieldProjectSector,
  FieldBusinessActivity,
  FieldClientContacts,
  FieldReferralSourceAdviser,
  FieldReferralSourceHierarchy,
  FieldEstimatedLandDate,
} from '../../../../../client/modules/Investments/Projects/InvestmentFormFields'

const findSelectedItem = (items, value) =>
  items ? items.find((type) => type.value === value) : null

const InvestmentDetailsStep = ({ values, company }) => {
  const investmentType = findSelectedItem(
    values.investmentTypes,
    values.investment_type
  )
  const fdiType = findSelectedItem(values.fdiTypes, values.fdi_type)
  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <Step name="details">
        <SummaryTable
          caption="Investment type"
          data-test="typeOfInvestmentTable"
        >
          <SummaryTable.Row heading="Investment type">
            {investmentType ? investmentType.label : null}
          </SummaryTable.Row>
          <SummaryTable.Row heading="Type of FDI" hideWhenEmpty={true}>
            {fdiType ? fdiType.label : null}
          </SummaryTable.Row>
        </SummaryTable>

        <FieldProjectName />
        <FieldProjectDescription hint="Provide a short description of the project" />
        <FieldAnonDescription />
        <FieldProjectSector />
        <FieldBusinessActivity />

        {Object.keys(values).length &&
          values?.business_activities?.find(
            (element) => element.label === 'Other'
          ) && (
            <FieldInput
              type="text"
              name="other_business_activity"
              label="Other business activity"
              hint="Tell us more about the other business activity here"
              required="Enter an 'Other' business activity"
            />
          )}

        <Task>
          {(getTask) => {
            const openContactFormTask = getTask(
              TASK_REDIRECT_TO_CONTACT_FORM,
              CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID
            )
            return (
              <>
                <FieldClientContacts companyId={company.id} />
                <ContactInformation
                  onOpenContactForm={({ redirectUrl }) => {
                    openContactFormTask.start({
                      payload: {
                        values,
                        url: redirectUrl,
                        storeId: CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID,
                      },
                    })
                  }}
                  companyId={company.id}
                />
              </>
            )
          }}
        </Task>

        <FieldRadios
          name="clientRelationshipManager"
          legend="Are you the client relationship manager for this project?"
          required="Select yes if you're the client relationship manager for this project"
          options={OPTIONS_YES_NO.map((option) => ({
            ...option,
            ...(option.value === OPTION_NO && {
              children: (
                <FieldSelect
                  name="client_relationship_manager"
                  options={values.advisers}
                  required="Choose a client relationship manager"
                  aria-label="Choose a client relationship manager"
                />
              ),
            }),
          }))}
        />

        <FieldRadios
          name="referralSourceAdviser"
          legend="Are you the referral source for this project?"
          required="Select yes if you're the referral source for this project"
          options={OPTIONS_YES_NO.map((option) => ({
            ...option,
            ...(option.value === OPTION_NO && {
              children: <FieldReferralSourceAdviser />,
            }),
          }))}
        />

        <FieldReferralSourceHierarchy />

        <FieldEstimatedLandDate />

        <FieldTypeahead
          name="likelihood_to_land"
          label="Likelihood of landing"
          options={values.likelihoodToLand}
          placeholder="Select a likelihood of landing value"
          data-test="likelihood-to-land"
        />

        <FieldDate
          name="actual_land_date"
          label="Actual land date (optional)"
          hint="The date investment project activities started"
          invalid="Enter a valid actual land date"
          data-test="actual-land-date"
        />

        <FieldTypeahead
          name="investor_type"
          label="Is the investor new or existing? (optional)"
          options={values.investmentInvestorType}
          placeholder="Choose an investor type"
          data-test="investor-type"
        />

        <FieldTypeahead
          name="level_of_involvement"
          label="Level of investor involvement (optional)"
          options={values.investmentInvolvement}
          placeholder="Choose a level of involvement"
          data-test="level-of-involvement"
        />

        <FieldTypeahead
          name="specific_programme"
          label="Specific investment programme (optional)"
          options={values.investmentSpecificProgramme}
          placeholder="Choose a specific programme"
          data-test="specific-investment-programme"
        />
      </Step>
    </FormLayout>
  )
}

const optionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

InvestmentDetailsStep.propTypes = {
  company: PropTypes.object,
  values: PropTypes.shape({
    investmentTypes: PropTypes.arrayOf(optionProp),
    investment_type: PropTypes.string,
    fdiTypes: PropTypes.arrayOf(optionProp),
    fdi_type: PropTypes.string,
    sectors: PropTypes.arrayOf(optionProp),
    investmentBusinessActivity: PropTypes.arrayOf(optionProp),
    advisers: PropTypes.arrayOf(PropTypes.object),
    referralSourceActivity: PropTypes.arrayOf(optionProp),
    referralSourceMarketing: PropTypes.arrayOf(optionProp),
    referralSourceWebsite: PropTypes.arrayOf(optionProp),
    investmentInvestorType: PropTypes.arrayOf(optionProp),
    investmentInvolvement: PropTypes.arrayOf(optionProp),
    investmentSpecificProgramme: PropTypes.arrayOf(optionProp),
    likelihoodToLand: PropTypes.arrayOf(optionProp),
  }),
}

export default InvestmentDetailsStep
