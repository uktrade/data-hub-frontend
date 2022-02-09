import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { H1 } from '@govuk-react/heading'

import FieldCheckboxes from '../FieldCheckboxes'
import Form from '../../../Form'

import exampleReadme from '../FieldCheckboxes/example.md'
import usageReadme from '../FieldCheckboxes/usage.md'

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

addDecorator(withKnobs)

storiesOf('Form/Form Elements/Checkboxes', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
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
  ))
  .add('Checkboxes - hint', () => (
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
  ))
  .add('Checkboxes - legend', () => (
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
  ))
