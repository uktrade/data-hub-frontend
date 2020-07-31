import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'
import { H1 } from '@govuk-react/heading'

import FieldCheckboxes from '../FieldCheckboxes'
import FormStateful from '../FormStateful'

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

storiesOf('Forms/Checkboxes', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FormStateful>
      {(form) => (
        <>
          <FieldCheckboxes
            name="countries"
            label="What are your favourite countries?"
            required="Select at least one country"
            options={options}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('Checkboxes - hint', () => (
    <FormStateful>
      {(form) => (
        <>
          <FieldCheckboxes
            name="countries"
            label="What are your favourite countries?"
            hint="Some hint"
            required="Select at least one country"
            options={options}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('Checkboxes - legend', () => (
    <FormStateful>
      {(form) => (
        <>
          <FieldCheckboxes
            name="countries2"
            legend={<H1>Using H1 as legend</H1>}
            hint="Some hint"
            required="Select at least one country"
            options={options}
          />

          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('Default (reduced)', () => (
    <FormStateful>
      {(form) => (
        <>
          <FieldCheckboxes
            name="countries"
            label="What are your favourite countries?"
            required="Select at least one country"
            hint="Some hint"
            options={options}
            reduced={true}
            reducedPadding={true}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('Checkboxes - legend (reduced)', () => (
    <FormStateful>
      {(form) => (
        <>
          <FieldCheckboxes
            legend={<H1>Using H1 as legend</H1>}
            name="countries"
            label="What are your favourite countries?"
            required="Select at least one country"
            hint="Some hint"
            options={options}
            reduced={true}
            reducedPadding={true}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
