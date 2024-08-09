import _ from 'lodash'
import React from 'react'
import { H2, H4 } from 'govuk-react'
import { useParams, Routes, Route } from 'react-router-dom'
import pluralize from 'pluralize'
import styled from 'styled-components'

import HR from '../../../components/HR'

import ThankYou from './ThankYou'
import CookiePage from './CookiePage'

import Layout from './Layout'
import {
  Form,
  FieldInput,
  FieldRadios,
  Step,
  SummaryTable,
  FieldTextarea,
  FieldCheckboxes,
} from '../../../components'
import State from '../../../components/State'
import ExportWinReview from '../../../components/Resource/ExportWinReview'
import Rating from '../../../components/Resource/Rating'
import Experience from '../../../components/Resource/Experience'
import { WithoutOurSupport } from '../../../components/Resource'
import MarketingSource from '../../../components/Resource/MarketingSource'
import Err from '../../../components/Task/Error'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'

import AccesibilityStatement from './AccesibilityStatement'

const FORM_ID = 'export-wins-customer-feedback'

const NormalFontWeightRow = styled(SummaryTable.Row)`
  & th {
    font-weight: normal;
  }
`

const groupBreakdowns = (breakdowns) => {
  const result =
    breakdowns.reduce(
      ({ groups: groups, totalAmount, yearRange }, breakdown) => {
        const group = groups[breakdown.type.name]

        return {
          totalAmount: totalAmount + breakdown.value,
          yearRange: {
            min: Math.min(yearRange.min, breakdown.year),
            max: Math.max(yearRange.max, breakdown.year),
          },
          groups: {
            ...groups,
            [breakdown.type.name]: {
              yearRange: {
                min: Math.min(group?.yearRange.min || Infinity, breakdown.year),
                max: Math.max(group?.yearRange.min || 0, breakdown.year),
              },
              total: (group?.total || 0) + breakdown.value,
            },
          },
        }
      },
      {
        groups: {},
        totalAmount: 0,
        yearRange: { min: Infinity, max: 0 },
      }
    ) || {}

  return {
    ...result,
    totalYears: result.yearRange.max - result.yearRange.min + 1,
  }
}

const NotFound = (props) =>
  props.error?.httpStatusCode === 404 ? (
    <>
      <H4 as="h2">The link you used has expired</H4>
      <p>
        Please get in touch with the Department of Business and Trade contact
        mentioned in your email, who will be able to send you a new link.
      </p>
    </>
  ) : (
    Err(props)
  )

const transformPayload =
  (token) =>
  ({ checkboxes1 = [], checkboxes2 = [], ...values }) => ({
    token,
    review: {
      ...values,
      ...Object.fromEntries(
        [...checkboxes1, ...checkboxes2].map((x) => [x, true])
      ),
      ..._(values)
        .pick(['agree_with_win', 'case_study_willing'])
        .mapValues((value) => (value === 'yes' ? true : false))
        .value(),
      ..._(values)
        .pick([
          'access_to_contacts',
          'access_to_information',
          'developed_relationships',
          'expected_portion_without_help',
          'gained_confidence',
          'improved_profile',
          'last_export',
          'marketing_source',
          'our_support',
          'overcame_problem',
        ])
        .mapValues((id) => ({ id }))
        .value(),
    },
  })

const CurrentFormStepInfo = () => (
  <State>
    {({ Form }) => {
      if (!Form?.[FORM_ID]) return null
      const { currentStep, steps } = Form[FORM_ID]

      return (
        <>
          Step {currentStep + 1} of {steps.length}
        </>
      )
    }}
  </State>
)

const Step1 = ({ win, name }) => {
  const { groups, totalAmount, totalYears } = win
    ? groupBreakdowns(win.breakdowns)
    : {}

  return (
    <Step name="1">
      {name && <p>Hi {name},</p>}
      <p>
        Thank you for taking the time to review our record of your recent export
        success.
      </p>
      <HR />
      <H2>Details of your recent success</H2>
      <SummaryTable data-test="export-wins-details-table">
        <SummaryTable.Row heading="Destination country">
          {win?.country?.name}
        </SummaryTable.Row>
        {Object.keys(groups).length > 1 &&
          Object.entries(groups).map(([k, { total, yearRange }]) => {
            const years = yearRange.max - yearRange.min + 1
            return (
              <NormalFontWeightRow key={k} heading={k}>
                {`${currencyGBP(total)} over ${years} ${pluralize('year', years)}`}
              </NormalFontWeightRow>
            )
          })}
        <SummaryTable.Row heading="Total value">
          {`${currencyGBP(totalAmount)} over ${totalYears} ${pluralize('year', totalYears)}`}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Date won">
          {formatMediumDate(win?.date)}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Lead officer name">
          {win?.leadOfficer?.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Summary of support received">
          {win?.description}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Your export experience before this win can be described as">
          {win?.exportExperience?.name}
        </SummaryTable.Row>
      </SummaryTable>

      {/* TODO: Create a FieldBoolean component */}
      <FieldRadios
        name="agree_with_win"
        required="Select if the information is correct or needs revising"
        options={[
          { label: 'I confirm this information is correct', value: 'yes' },
          { label: 'Some of this information needs revising', value: 'no' },
        ]}
      />
    </Step>
  )
}

const Step2 = ({ agree }) => (
  <Step name="2">
    <H2>The extent our support helped</H2>
    <WithoutOurSupport.FieldRadios
      name="expected_portion_without_help"
      legend="What value do you estimate you would have achieved without our support?"
      required="Select the estimated support value"
    />
    <FieldTextarea
      name="comments"
      label={`Comments${agree ? ' (optional)' : ''}`}
      hint={
        agree
          ? 'Please provide feedback on the help we have provided. If any of the information is incorrect please provide details.'
          : 'Please let us know what information was incorrect'
      }
      required={!agree && 'Please let us know what information was incorrect'}
    />
  </Step>
)

const Step3 = () => (
  <Step name="3">
    <H2>The extent our support helped</H2>
    <Rating.FieldRadios
      name="our_support"
      legend="Securing the win overall?"
      required="Select how much we helped with securing the win"
    />
    <Rating.FieldRadios
      name="access_to_contacts"
      legend="Gaining access to contacts?"
      required="Select how we helped with access to contacts"
    />
    <Rating.FieldRadios
      name="access_to_information"
      legend="Getting information or improved understanding of the country?"
      required="Select how we helped with information or understanding of the country"
    />
    <Rating.FieldRadios
      name="improved_profile"
      legend="Improving your profile or credibility in the country?"
      required="Select how we helped with improving your profile or credibility in the country"
    />
    <Rating.FieldRadios
      name="gained_confidence"
      legend="Having confidence to explore or expand in the country?"
      required="Select how we helped gain confidence or expand in the country"
    />
    <Rating.FieldRadios
      name="developed_relationships"
      legend="Developing or nurturing critical relationships?"
      required="Select how we helped to develop or nurture critical relationships"
    />
    <Rating.FieldRadios
      name="overcame_problem"
      legend="Overcoming a problem in the country (for example legal, regulatory, commercial)"
      required="Select how we helped overcome a problem in the country"
    />
  </Step>
)

const Step4 = () => (
  <Step name="4">
    <H2>About this win</H2>
    <FieldCheckboxes
      name="checkboxes1"
      legend="Please tick all that apply to this win:"
      options={[
        {
          label:
            'The win involved a foreign government or state-owned enterprise (for example as an intermediary or facilitator)',
          value: 'involved_state_enterprise',
        },
        {
          label: 'Our support was a prerequisite to generate this value',
          value: 'interventions_were_prerequisite',
        },
        {
          label: 'Our support helped you achieve this win more quickly',
          value: 'support_improved_speed',
        },
      ]}
    />
    <FieldCheckboxes
      name="checkboxes2"
      legend="Tick any that apply to this win:"
      options={[
        {
          label: 'It enabled you to expand into a new market',
          value: 'has_enabled_expansion_into_new_market',
        },
        {
          label: 'It enabled you to maintain or expand in an existing market',
          value: 'has_enabled_expansion_into_existing_market',
        },
        {
          label:
            'It enabled you to increase exports as a proportion of your turnover',
          value: 'has_increased_exports_as_percent_of_turnover',
        },
        {
          label:
            "If you hadn't achieved this win, your company might have stopped exporting",
          value: 'company_was_at_risk_of_not_exporting',
        },
        {
          label:
            'Apart from this win, you already have plans to export in the next 12 months',
          value: 'has_explicit_export_plans',
        },
      ]}
    />
  </Step>
)

const Step5 = () => (
  <Step name="5">
    <H2>Your export experience</H2>
    <Experience.FieldRadios
      name="last_export"
      legend="Apart from this win, when did your company last export goods or services?"
      required="Select when your company last exported goods or services"
    />
  </Step>
)

const Step6 = () => (
  <Step name="6" submitButtonLabel="Confirm and send">
    <H2>Marketing</H2>
    <FieldRadios
      name="case_study_willing"
      legend="Would you be willing for DBT/Exporting is GREAT to feature your success in marketing materials?"
      required="Select if you are willing to feature your success in DBT / Exporting is GREAT marketing"
      options={[
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ]}
    />
    <MarketingSource.FieldRadios
      name="marketing_source"
      legend="How did you first hear about DBT (or it predecessor, DIT)?"
      required="Select where you first heard about DBT"
      interceptOption={(option) =>
        option.label.endsWith('(please specify)')
          ? {
              ...option,
              children: (
                <FieldInput
                  name="other_marketing_source"
                  type="text"
                  label="Other way you heard about DBT"
                  required="Enter a description of the other way you heard about DBT"
                  hint="Please describe the other way you heard about DBT"
                />
              ),
            }
          : option
      }
    />
  </Step>
)

const Review = () => {
  const { token } = useParams()
  return (
    <Layout
      title="Tell us what made a difference"
      supertitle={<CurrentFormStepInfo />}
    >
      <ExportWinReview
        id={token}
        taskStatusProps={{
          renderError: NotFound,
        }}
      >
        {(review) => (
          <Form
            id={FORM_ID}
            analyticsFormName={FORM_ID}
            submissionTaskName="TASK_PATCH_EXPORT_WIN_REVIEW"
            redirectMode="soft"
            redirectTo={(_, { agree_with_win }) =>
              `../thankyou?agree=${agree_with_win}`
            }
            transformPayload={transformPayload(token)}
          >
            {(formData) => (
              <>
                <Step1 win={review.win} name={review?.companyContact?.name} />
                <Step2 agree={formData.values.agree_with_win === 'yes'} />
                <Step3 />
                <Step4 />
                <Step5 />
                <Step6 />
              </>
            )}
          </Form>
        )}
      </ExportWinReview>
    </Layout>
  )
}

export default () => (
  <Routes>
    <Route path="/accesibility-statement" element={<AccesibilityStatement />} />
    <Route path="/thankyou" element={<ThankYou />} />
    <Route path="/cookies" element={<CookiePage />} />
    <Route path="/:token" element={<Review />} />
  </Routes>
)
