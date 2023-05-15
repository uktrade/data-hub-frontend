import React from 'react'

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

export default {
  title: 'Filters/Checkbox',

  parameters: {
    component: CheckboxGroupField,
  },
}

export const Default = () => (
  <CheckboxGroupField
    name="countries"
    label="What are your favourite countries?"
    options={options}
  />
)

export const WithHint = () => (
  <CheckboxGroupField
    name="countries"
    label="What are your favourite countries?"
    hint="Some hint"
    options={options}
  />
)

WithHint.story = {
  name: 'With hint',
}

export const OverflowWithScroll = () => (
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
)

OverflowWithScroll.story = {
  name: 'Overflow with scroll',
}
