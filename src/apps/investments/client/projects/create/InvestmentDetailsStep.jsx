import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { GREY_2 } from '../../../../../client/utils/colours'
import {
  Step,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTypeahead,
  SummaryTable,
  ContactInformation,
  FormLayout,
} from '../../../../../client/components'
import { CompanyContactsResource } from '../../../../../client/components/Resource'
import { OPTION_NO, OPTIONS_YES_NO } from '../../../../constants'
import Task from '../../../../../client/components/Task'
import { CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../../../client/components/ContactForm/state'
import {
  FieldProjectName,
  FieldProjectDescription,
  FieldAnonDescription,
} from '../../../../../client/modules/Investments/Projects/InvestmentFormFields'

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

const StyledFieldInput = styled(FieldInput)({
  width: '100%',
})

const findSelectedItem = (items, value) =>
  items ? items.find((type) => type.value === value) : null

const buildReferralSourceHierarchy = (
  {
    referralSourceActivity = [],
    referralSourceMarketing,
    referralSourceWebsite,
  },
  {
    referral_source_activity_event,
    referral_source_activity_marketing,
    referral_source_activity_website,
  }
) =>
  referralSourceActivity.map((item) => ({
    ...item,
    ...(item.label === 'Event'
      ? {
          children: (
            <StyledContainer error={referral_source_activity_event}>
              <StyledFieldInput
                type="text"
                name="referral_source_activity_event"
                label="Event type"
                required="Enter an event type"
              />
            </StyledContainer>
          ),
        }
      : {}),
    ...(item.label === 'Marketing'
      ? {
          children: (
            <StyledContainer error={referral_source_activity_marketing}>
              <FieldSelect
                name="referral_source_activity_marketing"
                label="Choose a marketing type"
                aria-label="Choose a marketing type"
                required="You must choose a marketing type"
                options={referralSourceMarketing}
                fullWidth={true}
              />
            </StyledContainer>
          ),
        }
      : {}),
    ...(item.label === 'Website'
      ? {
          children: (
            <StyledContainer error={referral_source_activity_website}>
              <FieldSelect
                name="referral_source_activity_website"
                label="Choose a website"
                aria-label="Choose a website"
                required="You must choose a website"
                options={referralSourceWebsite}
                fullWidth={true}
              />
            </StyledContainer>
          ),
        }
      : {}),
  }))

const InvestmentDetailsStep = ({ values, errors, company }) => {
  const referralSourceHierarchy = buildReferralSourceHierarchy(values, errors)
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

        <FieldTypeahead
          name="sector"
          label="Primary sector"
          options={values.sectors}
          placeholder="Choose a sector"
          required="Choose a sector"
          data-test="primary-sector"
        />

        <FieldTypeahead
          name="business_activities"
          label="Business activities"
          hint="You can select more than one activity"
          placeholder="Search"
          required="Choose a business activity"
          options={values.investmentBusinessActivity}
          isMulti={true}
          data-test="business-activities"
        />

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
              <CompanyContactsResource id={company.id}>
                {({ results }) => {
                  return (
                    <>
                      <FieldTypeahead
                        name="client_contacts"
                        label="Client contact details"
                        placeholder="Search"
                        required="Choose a client contact"
                        data-test="client-contact"
                        options={results.map(({ name, id }) => ({
                          label: name,
                          value: id,
                        }))}
                        isMulti={true}
                      />
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
              </CompanyContactsResource>
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
              children: (
                <FieldSelect
                  name="referral_source_adviser"
                  options={values.advisers}
                  required="Choose a referral source adviser"
                  aria-label="Choose a referral source adviser"
                />
              ),
            }),
          }))}
        />

        <FieldSelect
          name="referral_source_activity"
          label="Referral source activity"
          emptyOption="Choose a referral source activity"
          options={referralSourceHierarchy}
          required="Choose a referral source activity"
          data-test="referral-source-activity"
          fullWidth={true}
        />

        <FieldDate
          format="short"
          name="estimated_land_date"
          label="Estimated land date"
          hint="An estimated date of when investment project activities will start"
          required="Enter an estimated land date"
          invalid="Enter a valid estimated land date"
          data-test="estimated-land-date"
        />

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
