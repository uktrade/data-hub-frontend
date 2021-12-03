import React from 'react'
import { storiesOf } from '@storybook/react'

import TaskReactSelect from '../ReactSelect'
import TaskTypeahead from '../Typeahead'

storiesOf('Task/Typeahead', module)
  .add('ReactSelect', () => (
    <>
      <TaskReactSelect
        placeholder="Select single"
        id="task-react-select-example-single"
        taskName="Task typeahead example options"
      />
      <br />
      <TaskReactSelect
        placeholder="Select multi"
        id="task-react-select-example-multi"
        taskName="Task typeahead example options"
        isMulti={true}
      />
    </>
  ))
  .add('Typeahead', () => (
    <>
      <TaskTypeahead
        placeholder="Select single"
        id="task-typeahead-example-single"
        taskName="Task typeahead example options"
      />
      <br />
      <TaskTypeahead
        placeholder="Select multi"
        id="task-typeahead-example-multi"
        taskName="Task typeahead example options"
        isMulti={true}
      />
    </>
  ))
