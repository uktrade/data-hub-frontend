import React from 'react'
import { storiesOf } from '@storybook/react'

import FieldInput from '../FieldInput'
import Form from '../../../Form'

storiesOf('Form/Form Elements/Input', module)
  .addParameters({ component: FieldInput })
  .add('Text', () => (
    <Form
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit Form example"
    >
      {(state) => (
        <>
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
  .add('Number', () => (
    <Form
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit Form example"
    >
      {(state) => (
        <>
          <FieldInput
            label="Number"
            hint="Some hint"
            name="testField"
            required="Enter number"
            type="number"
          />
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
  .add('Text (reduced)', () => (
    <Form
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit Form example"
    >
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
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
