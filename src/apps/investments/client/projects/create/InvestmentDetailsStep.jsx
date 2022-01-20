import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'

import {
  Step,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTextarea,
  FieldTypeahead,
  SummaryTable,
} from '../../../../../client/components'
import CompanyContactsResource from '../../../../../client/components/Resource/CompanyContacts'
import { OPTION_YES, OPTION_NO, OPTIONS_YES_NO } from './constants'
import Task from '../../../../../client/components/Task'
import urls from '../../../../../lib/urls'
import {
  CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID,
  TASK_CREATE_INVESTMENT_OPEN_CONTACT_FORM,
} from './state'

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

const StyledFieldSelect = styled(FieldSelect)({
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
              <StyledFieldSelect
                name="referral_source_activity_marketing"
                label="Choose a marketing type"
                aria-label="Choose a marketing type"
                required="You must choose a marketing type"
                options={referralSourceMarketing}
              />
            </StyledContainer>
          ),
        }
      : {}),
    ...(item.label === 'Website'
      ? {
          children: (
            <StyledContainer error={referral_source_activity_website}>
              <StyledFieldSelect
                name="referral_source_activity_website"
                label="Choose a website"
                aria-label="Choose a website"
                required="You must choose a website"
                options={referralSourceWebsite}
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
    <Step name="details">
      <SummaryTable
        caption="Type of investment"
        data-test="typeOfInvestmentTable"
      >
        <SummaryTable.Row heading="Type of investment">
          {investmentType ? investmentType.label : null}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Type of FDI" hideWhenEmpty={true}>
          {fdiType ? fdiType.label : null}
        </SummaryTable.Row>
      </SummaryTable>

      <FieldInput
        type="text"
        name="name"
        label="Project name"
        required="Enter a project name"
        data-test="name"
      />

      <FieldTextarea
        type="text"
        name="description"
        label="Project description"
        hint="Provide a short description of the project"
        required="Enter a project description"
        data-test="description"
      />

      <FieldTextarea
        type="text"
        name="anonymous_description"
        label="Anonymous project details"
        hint="Do not include company names, financial details or addresses"
        required="Enter anonymous project details"
        data-test="anonymous-description"
      />

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

      <FieldRadios
        name="otherBusinessActivity"
        legend="Do you want to add another activity that is not available above?"
        initialValue={OPTION_NO}
        options={OPTIONS_YES_NO.map((option) => ({
          ...option,
          ...(option.value === OPTION_YES && {
            children: (
              <FieldInput
                type="text"
                name="other_business_activity"
                label="Other business activity"
                hint="Tell us more about the other business activity here"
                required="You must enter a business activity"
              />
            ),
          }),
        }))}
      />

      <Task>
        {(getTask) => {
          const openContactFormTask = getTask(
            TASK_CREATE_INVESTMENT_OPEN_CONTACT_FORM,
            CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID
          )
          return (
            <CompanyContactsResource id={company.id}>
              {({ results }) => {
                return (
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
                    hint={
                      <>
                        If you can not find a contact you're looking for, you
                        can{' '}
                        <Link
                          onClick={(e) => {
                            e.preventDefault()
                            openContactFormTask.start({
                              payload: {
                                values,
                                url: e.target.href,
                              },
                            })
                          }}
                          href={urls.contacts.create(company.id, {
                            origin_url: window.location.pathname,
                          })}
                        >
                          add a new contact
                        </Link>
                        .
                      </>
                    }
                  />
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

      <StyledFieldSelect
        name="referral_source_activity"
        label="Referral source activity"
        emptyOption="Choose a referral source activity"
        options={referralSourceHierarchy}
        required="Choose a referral source activity"
        data-test="referral-source-activity"
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
  }),
}

export default InvestmentDetailsStep
