import React from 'react'
import PropTypes from 'prop-types'

import {
  Step,
  FieldInput,
  FieldRadios,
  SummaryTable,
  ContactInformation,
  FormLayout,
  FieldAdvisersTypeahead,
} from '../../../../../client/components'
import {
  FieldActualLandDate,
  FieldAnonDescription,
  FieldBusinessActivity,
  FieldClientContacts,
  FieldEstimatedLandDate,
  FieldInvestmentInvestorType,
  FieldLevelOfInvolvement,
  FieldLikelihoodOfLanding,
  FieldProjectDescription,
  FieldProjectName,
  FieldProjectSector,
  FieldReferralSourceAdviser,
  FieldReferralSourceHierarchy,
  FieldSpecificProgramme,
} from '../../../../../client/modules/Investments/Projects/InvestmentFormFields'
import Task from '../../../../../client/components/Task'
import { CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID } from './state'
import {
  FORM_LAYOUT,
  OPTION_NO,
  OPTIONS_YES_NO,
} from '../../../../../common/constants'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../../../client/components/ContactForm/state'
import { FDI_TYPES } from '../../../../../client/modules/Investments/Projects/constants'

const findSelectedItem = (items, value) =>
  items ? items.find((type) => type.value === value) : null

const InvestmentDetailsStep = ({ values, company }) => {
  const investmentType = findSelectedItem(
    values.investmentTypes,
    values.investment_type
  )
  const fdiType = findSelectedItem(values.fdiTypes, values.fdi_type?.value)
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
                <FieldAdvisersTypeahead
                  name="client_relationship_manager"
                  required="Choose a client relationship manager"
                  aria-label="Choose a client relationship manager"
                  label="Who is the referral source for this project?"
                />
              ),
            }),
          }))}
        />

        <FieldReferralSourceAdviser label="Who is the referral source for this project?" />
        <FieldReferralSourceHierarchy />
        <FieldEstimatedLandDate />
        <FieldLikelihoodOfLanding />
        <FieldActualLandDate />
        {values.fdi_type?.value ===
        FDI_TYPES.expansionOfExistingSiteOrActivity.value ? null : (
          <FieldInvestmentInvestorType label="Is the investor new or existing?" />
        )}
        <FieldLevelOfInvolvement />
        <FieldSpecificProgramme />
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
    fdi_type: PropTypes.object,
  }),
}

export default InvestmentDetailsStep
