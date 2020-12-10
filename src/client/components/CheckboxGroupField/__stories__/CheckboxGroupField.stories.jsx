import React from 'react'
import { storiesOf } from '@storybook/react'
import CheckboxGroupField from '..'

import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

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

storiesOf('Filters/Checkbox', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <CheckboxGroupField
      name="countries"
      label="What are your favourite countries?"
      options={options}
    />
  ))
  .add('With hint', () => (
    <CheckboxGroupField
      name="countries"
      label="What are your favourite countries?"
      hint="Some hint"
      options={options}
    />
  ))
