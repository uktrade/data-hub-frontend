import React from 'react'

import usageReadme from './usage.md'
import Typeahead from '../'

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
    query && query.length
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

export default {
  title: 'Typeahead',
  excludeStories: ['mockLoadOptions'],
}

export const DocsPlaceholder = () => (
  <p>
    This is a workaround to get the DocsPage to work with multiInstance
    components.
  </p>
)

DocsPlaceholder.story = {
  name: 'Docs placeholder',
}

export const SingleStandardOptions = () => (
  <Typeahead
    name="singleselect"
    isMulti={false}
    initialOptions={options}
    placeholder="Search..."
    label="Pick a fruit"
  />
)

SingleStandardOptions.story = {
  name: 'Single - standard options',

  parameters: {
    docs: {
      storyDescription: usageReadme,
    },
  },
}

export const SinglePreSelectedOption = () => (
  <Typeahead
    name="singleselect-pre-select"
    isMulti={false}
    initialOptions={options}
    placeholder="Search..."
    defaultValue={options[2]}
    label="Pick a fruit"
  />
)

SinglePreSelectedOption.story = {
  name: 'Single - pre-selected option',
}

export const SingleError = () => (
  <Typeahead
    name="singleselect-error"
    error={true}
    isMulti={false}
    initialOptions={options}
    placeholder="Search..."
    label="Pick a fruit"
  />
)

SingleError.story = {
  name: 'Single - error',
}

export const SingleAsyncOptions = () => (
  <div style={{ width: '600px' }}>
    <h2>Search for</h2>
    <ul>
      <li>Bernard</li>
      <li>Dennis</li>
      <li>Denzil</li>
      <li>Holly</li>
    </ul>
    <Typeahead
      isMulti={false}
      name="singleselect"
      loadOptions={mockLoadOptions}
      placeholder="Search..."
      label="Pick an adviser"
    />
  </div>
)

SingleAsyncOptions.story = {
  name: 'Single - async options',
}

export const MultiStandardOptions = () => (
  <Typeahead
    isMulti={true}
    closeMenuOnSelect={false}
    name="multiselect"
    initialOptions={options}
    placeholder="Search..."
    label="Pick a fruit"
  />
)

MultiStandardOptions.story = {
  name: 'Multi - standard options',
}

export const MultiPreSelectedOption = () => (
  <Typeahead
    isMulti={true}
    closeMenuOnSelect={false}
    name="multiselect-pre-select"
    initialOptions={options}
    placeholder="Search..."
    defaultValue={options[2]}
    label="Pick a fruit"
  />
)

MultiPreSelectedOption.story = {
  name: 'Multi - pre-selected option',
}

export const MultiPreSelectedMultipleOptions = () => (
  <Typeahead
    isMulti={true}
    closeMenuOnSelect={false}
    name="multiselect-pre-select-multiple"
    initialOptions={options}
    placeholder="Search..."
    defaultValue={[options[2], options[0]]}
    label="Pick a fruit"
  />
)

MultiPreSelectedMultipleOptions.story = {
  name: 'Multi - pre-selected multiple options',
}

export const MultiAsyncOptions = () => (
  <div style={{ width: '600px' }}>
    <h2>Search for</h2>
    <ul>
      <li>Bernard</li>
      <li>Dennis</li>
      <li>Denzil</li>
      <li>Holly</li>
    </ul>
    <Typeahead
      isMulti={true}
      closeMenuOnSelect={false}
      name="multiselect-async"
      loadOptions={mockLoadOptions}
      placeholder="Search advisers..."
      noOptionsMessage="No advisers found"
      aria-label="search"
    />
  </div>
)

MultiAsyncOptions.story = {
  name: 'Multi - async options',
}

export const MultiAsyncPreSelectedOptions = () => (
  <div style={{ width: '600px' }}>
    <h2>Search for</h2>
    <ul>
      <li>Bernard</li>
      <li>Dennis</li>
      <li>Denzil</li>
      <li>Holly</li>
    </ul>
    <Typeahead
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
)

MultiAsyncPreSelectedOptions.story = {
  name: 'Multi - async pre-selected options',
}
