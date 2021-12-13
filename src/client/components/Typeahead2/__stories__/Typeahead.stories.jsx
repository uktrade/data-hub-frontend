import React from 'react'
import { storiesOf } from '@storybook/react'

import usageReadme from '../usage.md'
import exampleReadme from '../example.md'
import Typeahead from '../Typeahead'

const options = [
  { value: '0001', label: 'Apple' },
  { value: '0002', label: 'Banana' },
  { value: '0003', label: 'Blueberry' },
  { value: '0004', label: 'Blackberry' },
  { value: '0005', label: 'Orange' },
  { value: '0006', label: 'Papaya' },
  { value: '0007', label: 'Passion Fruit' },
  { value: '0008', label: 'Pear' },
  { value: '0009', label: 'Pineapple' },
  { value: '0010', label: 'Prickly Pear That Has a Very Very Long Name' },
]

storiesOf('Typeahead2', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Single - standard options', () => (
    <Typeahead
      id="typeahead-single-1"
      isMulti={false}
      closeMenuOnSelect={true}
      name="singleselect"
      options={options}
      placeholder="Search..."
      label="Pick a fruit"
    />
  ))
  .add('Single - pre-selected option', () => (
    <Typeahead
      id="typeahead-single-2"
      isMulti={false}
      closeMenuOnSelect={false}
      name="singleselect-pre-select"
      options={options}
      placeholder="Search..."
      defaultValue={options[2]}
      label="Pick a fruit"
    />
  ))
  .add('Single - error', () => (
    <Typeahead
      id="typeahead-single-3"
      error={true}
      isMulti={false}
      closeMenuOnSelect={false}
      name="singleselect-error"
      options={options}
      placeholder="Search..."
      label="Pick a fruit"
    />
  ))
  .add('Multi - standard options', () => (
    <Typeahead
      id="typeahead-multi-1"
      isMulti={true}
      closeMenuOnSelect={false}
      name="multiselect"
      options={options}
      placeholder="Search..."
      label="Pick a fruit"
    />
  ))
  .add('Multi - pre-selected option', () => (
    <Typeahead
      id="typeahead-multi-2"
      isMulti={true}
      closeMenuOnSelect={false}
      name="multiselect-pre-select"
      options={options}
      placeholder="Search..."
      defaultValue={options[2]}
      label="Pick a fruit"
    />
  ))
  .add('Multi - pre-selected multiple options', () => (
    <Typeahead
      id="typeahead-multi-3"
      isMulti={true}
      closeMenuOnSelect={false}
      name="multiselect-pre-select-multiple"
      options={options}
      placeholder="Search..."
      defaultValue={[options[2], options[0]]}
      label="Pick a fruit"
    />
  ))
