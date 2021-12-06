import React from 'react'
import { storiesOf } from '@storybook/react'

import TaskForm from '../../../Task/Form'
import FieldTaskTypeahead from '../FieldTaskTypeahead'

storiesOf('Forms/FieldTaskTypeahead', module).add('Default', () => (
  <TaskForm
    id="field-task-typeahead-example"
    analyticsFormName="foo"
    submissionTaskName="Submit TaskForm example"
  >
    {({ values }) => (
      <>
        <FieldTaskTypeahead
          id="field-task-typeahead-example-single"
          label="Single select"
          hint="Some hint"
          name="single"
          required="Choose value"
          taskName="Task typeahead example options"
        />
        <FieldTaskTypeahead
          id="field-task-typeahead-example-multi"
          label="Multi select"
          hint="Some hint"
          name="multi"
          required="Choose value"
          taskName="Task typeahead example options"
        />
        <pre>{JSON.stringify({ values }, null, 2)}</pre>
      </>
    )}
  </TaskForm>
))
