import React from 'react'
import { H1 } from '@govuk-react/heading'

import FieldCheckboxes from '../FieldCheckboxes'
import Form from '../../../Form'

const options = [
  {
    label: 'Italy',
    value: 'it',
  },
  {
    label: 'Poland',
    value: 'pl',
  },
  {
    label: 'United Kingdom',
    value: 'gb',
  },
  {
    label: 'United States',
    value: 'us',
    hint: 'Hints are supported!',
  },
]

export default {
  title: 'Form/Form Elements/Checkboxes',

  parameters: {
    component: FieldCheckboxes,
  },
}

export const Default = () => (
  <Form
    id="fieldCheckboxExample"
    analyticsFormName="fieldCheckboxExample"
    submissionTaskName="Submit Form example"
  >
    {(form) => (
      <>
        <FieldCheckboxes
          name="countries"
          label="What are your favourite countries?"
          required="Select at least one country"
          options={options}
        />
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </>
    )}
  </Form>
)

export const CheckboxesHint = () => (
  <Form
    id="fieldCheckboxExample"
    analyticsFormName="fieldCheckboxExample"
    submissionTaskName="Submit Form example"
  >
    {(form) => (
      <>
        <FieldCheckboxes
          name="countries"
          label="What are your favourite countries?"
          hint="Some hint"
          required="Select at least one country"
          options={options}
        />
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </>
    )}
  </Form>
)

CheckboxesHint.story = {
  name: 'Checkboxes - hint',
}

export const CheckboxesLegend = () => (
  <Form
    id="fieldCheckboxExample"
    analyticsFormName="fieldCheckboxExample"
    submissionTaskName="Submit Form example"
  >
    {(form) => (
      <>
        <FieldCheckboxes
          name="countries2"
          legend={<H1>Using H1 as legend</H1>}
          hint="Some hint"
          required="Select at least one country"
          options={options}
        />
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </>
    )}
  </Form>
)

CheckboxesLegend.story = {
  name: 'Checkboxes - legend',
}

export const CheckboxesExclusive = () => (
  <Form
    id="fieldCheckboxExample"
    analyticsFormName="fieldCheckboxExample"
    submissionTaskName="Submit Form example"
  >
    {(form) => (
      <>
        <FieldCheckboxes
          name="countries"
          label="Estimated land date notification preferences"
          hint="Select all that apply"
          required="Select at least one country or select 'No, ...'"
          exclusive={true}
          initialValue={['no']}
          options={[
            {
              label: 'France',
              value: 'fr',
            },
            {
              label: 'Portugal',
              value: 'pr',
            },
            {
              label: 'Spain',
              value: 'sp',
            },
            {
              label: 'No, I will not be travelling to any of these countries',
              value: 'no',
            },
          ]}
        />
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </>
    )}
  </Form>
)

CheckboxesExclusive.story = {
  name: 'Checkboxes - exclusive',
}
