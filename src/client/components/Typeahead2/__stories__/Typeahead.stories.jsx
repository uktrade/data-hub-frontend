import React from 'react'
import { storiesOf } from '@storybook/react'

import usageReadme from '../usage.md'
import exampleReadme from '../example.md'
import Typeahead from '../Typeahead'

const asyncOptions = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Holly Clins - Heart of the South West LEP',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Bernard Harris-Patelc - Welsh Government (Investment)',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Dennis Kennedy',
  },
  {
    value: 'eecd2bb8-dc73-4a42-8655-4ae42d4d3cff',
    label: 'Denzil Lincoln',
  },
]

export const mockLoadOptions = (query = '') =>
  new Promise((resolve) =>
    query && query.length > 2
      ? setTimeout(
          resolve,
          1000,
          asyncOptions.filter(({ label }) =>
            label.toLowerCase().includes(query.toLowerCase())
          )
        )
      : resolve([])
  )

const options = [
  { value: '0001', label: 'Apple' },
  { value: '0002', label: 'Banana' },
  { value: '0003', label: 'Blackberry' },
  { value: '0004', label: 'Blueberry' },
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
      closeMenuOnSelect={true}
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
  .add('Single - async options', () => (
    <div style={{ width: '600px' }}>
      <h2>Search for</h2>
      <ul>
        <li>Bernard</li>
        <li>Dennis</li>
        <li>Denzil</li>
        <li>Holly</li>
      </ul>
      <Typeahead
        id="typeahead-single-4"
        isMulti={false}
        closeMenuOnSelect={true}
        name="singleselect"
        loadOptions={mockLoadOptions}
        placeholder="Search..."
        label="Pick an adviser"
      />
    </div>
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
  .add('Multi - async options', () => (
    <div style={{ width: '600px' }}>
      <h2>Search for</h2>
      <ul>
        <li>Bernard</li>
        <li>Dennis</li>
        <li>Denzil</li>
        <li>Holly</li>
      </ul>
      <Typeahead
        id="ms-async"
        isMulti={true}
        closeMenuOnSelect={false}
        name="multiselect-async"
        loadOptions={mockLoadOptions}
        placeholder="Search advisers..."
        noOptionsMessage="No advisers found"
        aria-label="search"
      />
    </div>
  ))
  .add('Multi - async pre-selected options', () => (
    <div style={{ width: '600px' }}>
      <h2>Search for</h2>
      <ul>
        <li>Bernard</li>
        <li>Dennis</li>
        <li>Denzil</li>
        <li>Holly</li>
      </ul>
      <Typeahead
        id="ms-async"
        isMulti={true}
        closeMenuOnSelect={false}
        name="multiselect-async"
        loadOptions={mockLoadOptions}
        placeholder="Search advisers..."
        noOptionsMessage="No advisers found"
        defaultValue={[asyncOptions[2], asyncOptions[0]]}
        aria-label="search"
      />
    </div>
  ))
