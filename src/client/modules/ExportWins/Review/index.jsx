/* eslint-disable prettier/prettier */
import _ from 'lodash'
import React from "react"
import {H2} from 'govuk-react'
import { Route } from "react-router-dom/cjs/react-router-dom"

import Layout from "./Layout"
import {Form, FieldInput, FieldRadios, Step, SummaryTable, FieldTextarea, FieldCheckboxes} from '../../../components'
import State from '../../../components/State'
import ExportWinReview from '../../../components/Resource/ExportWinReview'
import { Summary } from "../Details"
import Rating from "../../../components/Resource/Rating"
import Experience from "../../../components/Resource/Experience"
import { WithoutOurSupport } from "../../../components/Resource"
import MarketingSource from "../../../components/Resource/MarketingSource"

const FORM_ID = 'export-wins-customer-feedback'

const transformPayload = token => ({checkboxes1 = [], checkboxes2 = [], ...values}) => ({
  token,
  review: {
    ...values,
    ...Object.fromEntries([
      ...checkboxes1,
      ...checkboxes2,
    ].map(x => [x, true])),
    ..._(values)
      .pick(['agree_with_win', 'case_study_willing'])
      .mapValues(value => value === 'yes' ? true : false)
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
      .mapValues(id => ({id}))
      .value(),
  },
})

const FieldComments = () =>
  <FieldTextarea
    name="comments"
    label="Comments (optional)"
    hint="Please provide feedback on the help we have provided. If any of the information is incorrect please provide details."
  />

const Supertitle = () =>
  <State>
    {({Form}) => {
      if (!Form?.[FORM_ID]) return null
      const {currentStep, steps} = Form[FORM_ID]
      return <>Step {currentStep + 1} of {steps.length}</>
    }}
  </State>

const Step1 = ({win, name}) =>
  <Step name="1">
    <p>Hi {name},</p>
    <p>
      Thank you for taking the time to review our record
      of your recent export success.
    </p>
    <hr/>
    <H2>Details of your recent success</H2>
    <Summary exportWin={win}>
      <SummaryTable.Row heading="Summary of support received">
        {win?.summary}
      </SummaryTable.Row>
    </Summary>

    {/* TODO: Create a FieldBoolean component */}
    <FieldRadios
      name="agree_with_win"
      required="Choose one of the options"
      options={[
        {label: 'I confirm this information is correct', value: 'yes'},
        {label: 'Some of this information needs revising', value: 'no'},
      ]}
    />
  </Step>

const Step2Agree = () =>
  <Step name="2-agree">
    <WithoutOurSupport.FieldRadios
      name="expected_portion_without_help"
      legend="What value do you estimate you would have achieved without our support?"
      required="Choose one of the options"
    />
    <FieldComments/>
  </Step>

const Step2Disagree = () =>
  <Step name="2-disagree">
    <FieldComments/>
  </Step>

const Step3 = () =>
  <Step name="3">
    <H2>The extent our support helped</H2>
    <Rating.FieldRadios
      name="our_support"
      legend="Securing the win overall?"
      required="Choose one of the options"
    />
    <Rating.FieldRadios
      name="access_to_contacts"
      legend="Gaining access to contacts?"
      required="Choose one of the options"
    />
    <Rating.FieldRadios
      name="access_to_information"
      legend="Getting information or improved understanding of the country?"
      required="Choose one of the options"
    />
    <Rating.FieldRadios
      name="improved_profile"
      legend="Improving your profile or credibility in the country?"
      required="Choose one of the options"
    />
    <Rating.FieldRadios
      name="gained_confidence"
      legend="Having confidence to explore or expand in the country?"
      required="Choose one of the options"
    />
    <Rating.FieldRadios
      name="developed_relationships"
      legend="Developing or nurturing critical relationships?"
      required="Choose one of the options"
    />
    <Rating.FieldRadios
      name="overcame_problem"
      legend="Overcoming a problem in the country (eg legal, regulatory, commercial)"
      required="Choose one of the options"
    />
  </Step>

const Step4 = () =>
  <Step name="4">
    <H2>About this win</H2>
    {/* All checkboxes are hardcoded values */}
    <FieldCheckboxes
      name="checkboxes1"
      legend="Please tick all that apply to this win:"
      options={[
        {
          label: 'The win involved a foreign government or state-owned enterprise (eg as an intermediary or facilitator)',
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
          label: 'It enabled vou to expand into a new market',
          value: 'has_enabled_expansion_into_new_market',
        },
        {
          label: 'It enabled you to maintain or expand in an existing market',
          value: 'has_enabled_expansion_into_existing_market',
        },
        {
          label: 'It enabled you to increase exports as a proportion of your turnover',
          value: 'has_increased_exports_as_percent_of_turnover',
        },
        {
          label: "If you hadn't achieved this win, your company might have stopped exporting",
          value: 'company_was_at_risk_of_not_exporting',
        },
        {
          label: 'Apart from this win, you already have plans to export in the next 12 months',
          value: 'has_explicit_export_plans',
        },
      ]}
    />
  </Step>

const Step5 = () =>
  <Step name="5">
    <H2>Your export experience</H2>
    <Experience.FieldRadios
      name="last_export"
      legend="Apart from this win, when did your company last export goods or services?"
      required="Choose one of the options"
    />
  </Step>

const Step6 = () =>
  <Step name="6">
    <H2>Marketing</H2>
    <FieldRadios
      name="case_study_willing"
      legend="Would you be willing for DBT/Exporting is GREAT to feature your success in marketing materials?"
      required="Choose one of the options"
      options={[
        {label: 'Yes', value: 'yes'},
        {label: 'No', value: 'no'},
      ]}
    />
    <MarketingSource.FieldRadios
      name="marketing_source"
      legend="How did you first hear about DBT (or it predecessor, DIT)?"
      required="Choose one of the options"
      interceptOption={option =>
        option.label.endsWith('(please specify)')
          ? {
            ...option,
            children:
              <FieldInput
                name="other_marketing_source"
                type="text"
                label="Label comes later"
                required="Please specify"
              />,
          }
          : option
      }
    />
  </Step>

// TODO: Rename to Review
const CustomerFeedback = ({token}) =>
  <Layout
    title="Tell us what made a difference"
    supertitle={<Supertitle/>}
  >
    <ExportWinReview id={token}>
      {({win, companyContact}) =>
        <Form
          id={FORM_ID}
          analyticsFormName={FORM_ID}
          submissionTaskName="TASK_PATCH_EXPORT_WIN_REVIEW"
          // showStepInUrl={true}
          redirectMode="soft"
          redirectTo={() => '/exportwins/review-win/thankyou'}
          transformPayload={transformPayload(token)}
          flashMessage={(_, {agree_with_win}) =>
            agree_with_win === 'yes'
              // TODO: Move to constants
              ? [
                  'Success',
                  'Thank you for taking time to review this export win',
                  'success',
                ]
              : [
                  'Important',
                  `Thank you for reviewing this export win
                  <br/>
                  <br/>
                  As you have asked for some changes to be made,
                  we will review your comments and may need to contact you
                  if we need more information.
                  `,
                  'info',
                ]
          }
        >
          {formData =>
            <>
              <Step1 {...{win, name: companyContact?.name}} />
              {formData.values.agree_with_win === 'yes' ?
                <>
                  <Step2Agree/>
                  <Step3/>
                  <Step4/>
                  <Step5/>
                  <Step6/>
                </>
                : <Step2Disagree/>
              }
              {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
              {/* <pre>{JSON.stringify(win, null, 2)}</pre> */}
            </>
          }
        </Form>
      }
    </ExportWinReview>
  </Layout>

export default CustomerFeedback

