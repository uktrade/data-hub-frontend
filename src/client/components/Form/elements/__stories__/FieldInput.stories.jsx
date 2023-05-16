import React from 'react'

import FieldInput from '../FieldInput'
import Form from '../../../Form'

export default {
  title: 'Form/Form Elements/Input',

  parameters: {
    component: FieldInput,
  },
}

export const Text = () => (
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
)

export const Number = () => (
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
)

export const TextReduced = () => (
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
)

TextReduced.story = {
  name: 'Text (reduced)',
}
