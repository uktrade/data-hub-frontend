import React from 'react'
import { storiesOf } from '@storybook/react'
import FilterCheckboxes from '../elements/FilterCheckboxes'

import exampleReadme from '../elements/FilterCheckboxes/example.md'
import usageReadme from '../elements/FilterCheckboxes/usage.md'

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

storiesOf('Filters/Checkboxes', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FilterCheckboxes
      name="countries"
      label="What are your favourite countries?"
      options={options}
      taskProps={{
        name: 'task name 1',
        id: 'id1',
      }}
    />
  ))
  .add('With hint', () => (
    <FilterCheckboxes
      name="countries"
      label="What are your favourite countries?"
      hint="some hint"
      options={options}
      taskProps={{
        name: 'task name 1',
        id: 'id1',
      }}
    />
  ))
