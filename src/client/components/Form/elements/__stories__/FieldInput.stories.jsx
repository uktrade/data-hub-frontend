import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions/dist'
import { withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'

import FieldInput from '../FieldInput'
import FormStateful from '../FormStateful'

import exampleReadme from '../FieldInput/example.md'
import usageReadme from '../FieldInput/usage.md'

addDecorator(withKnobs)

storiesOf('Forms/Input', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Text', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(state) => (
        <>
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('Number', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(state) => (
        <>
          <FieldInput
            label="Number"
            hint="Some hint"
            name="testField"
            required="Enter number"
            type="number"
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('Text (reduced)', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(state) => (
        <>
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
            reduced={true}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
