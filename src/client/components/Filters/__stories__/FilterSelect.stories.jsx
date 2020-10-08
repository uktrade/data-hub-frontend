import React from 'react'
import { storiesOf } from '@storybook/react'
import FilterSelect from '../elements/FilterSelect'

import exampleReadme from '../elements/FilterSelect/example.md'
import usageReadme from '../elements/FilterSelect/usage.md'

storiesOf('Filters/Select', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FilterSelect
      name="testField"
      label="Test select"
      initialValue={'testOptionValue2'}
      emptyOption={'Please select'}
      options={[
        { label: 'testOptionLabel1', value: 'testOptionValue1' },
        { label: 'testOptionLabel2', value: 'testOptionValue2' },
      ]}
      taskProps={{
        name: 'task name 1',
        id: 'id1',
      }}
    />
  ))
  .add('With hint', () => (
    <FilterSelect
      name="testField"
      label="Test select"
      hint="Some hint"
      initialValue={'testOptionValue2'}
      emptyOption={'Please select'}
      options={[
        { label: 'testOptionLabel1', value: 'testOptionValue1' },
        { label: 'testOptionLabel2', value: 'testOptionValue2' },
      ]}
      taskProps={{
        name: 'task name 2',
        id: 'id2',
      }}
    />
  ))
