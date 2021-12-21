import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import FieldInput from '../FieldInput'
import TaskForm from '../../../Task/Form'

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
    <TaskForm
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit TaskForm example"
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
    </TaskForm>
  ))
  .add('Number', () => (
    <TaskForm
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit TaskForm example"
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
    </TaskForm>
  ))
  .add('Text (reduced)', () => (
    <TaskForm
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit TaskForm example"
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
    </TaskForm>
  ))
