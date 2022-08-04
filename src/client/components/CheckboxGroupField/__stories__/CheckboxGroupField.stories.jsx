import React from 'react'
import { storiesOf } from '@storybook/react'
import CheckboxGroupField from '..'

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
  .addParameters({ component: CheckboxGroupField })
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
  .add('Overflow with scroll', () => (
    <CheckboxGroupField
      maxScrollHeight={215}
      name="countries"
      legend="What are your favourite countries?"
      options={[
        ...options,
        {
          label: 'Spain',
          value: 'sp',
        },
        {
          label: 'New Zealand',
          value: 'nz',
        },
        {
          label: 'China',
          value: 'ch',
        },
      ]}
      selectedOptions={[
        {
          label: 'Italy',
          value: 'it',
        },
        {
          label: 'Poland',
          value: 'pl',
        },
      ]}
    />
  ))
