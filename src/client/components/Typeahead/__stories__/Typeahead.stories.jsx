/* eslint "react/destructuring-assignment": 0, react/prop-types: 0 */

import React from 'react'
import { storiesOf } from '@storybook/react'

import Typeahead from '../Typeahead'
import SmallTypeahead from '../SmallTypeahead'

const options = [
  { value: '1234', label: 'Chocolate - mint' },
  { value: '5678', label: 'Strawberry - Cream' },
  { value: '9876', label: 'Vanilla - Vanilla' },
]

const asyncOptions = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Holly Clins - olHeart of the South West LEP',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Bernard Harris-Patelc - Welsh Government (Investment)',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Dennis Kennedy',
  },
]

const getOptions = () =>
  new Promise((resolve) => setTimeout(resolve, 1000, asyncOptions))

storiesOf('Typeahead/Single select', module)
  .add('Standard options', () => (
    <>
      <label htmlFor="test_1">Search</label>
      <Typeahead
        isMulti={false}
        closeMenuOnSelect={false}
        name="test_1"
        options={options}
        placeholder="Search..."
        aria-label="search"
      />
    </>
  ))
  .add('Error', () => (
    <>
      <label htmlFor="test_2">Search</label>
      <Typeahead
        error={true}
        isMulti={false}
        closeMenuOnSelect={false}
        name="test_2"
        options={options}
        placeholder="Search..."
        aria-label="search"
      />
    </>
  ))
  .add('Options - pre-selected option', () => (
    <>
      <label htmlFor="test_3">Search</label>
      <Typeahead
        isMulti={false}
        closeMenuOnSelect={false}
        label="Options - pre-selected option"
        name="test_3"
        options={options}
        placeholder="Search..."
        defaultValue={options[2]}
        aria-label="search"
      />
    </>
  ))
  .add('Small', () => (
    <>
      <label htmlFor="test_4">Search</label>
      <SmallTypeahead
        isMulti={false}
        closeMenuOnSelect={false}
        name="test_4"
        options={options}
        placeholder="Search..."
        aria-label="search"
      />
    </>
  ))

storiesOf('Typeahead/Multiple select', module)
  .add('Standard options', () => (
    <>
      <label htmlFor="test_5">Search</label>
      <Typeahead
        isMulti={true}
        closeMenuOnSelect={false}
        label="Standard options"
        name="test_5"
        options={options}
        placeholder="Search..."
        aria-label="search"
      />
    </>
  ))
  .add('Options - pre-selected option', () => (
    <>
      <label htmlFor="test_6">Search</label>
      <Typeahead
        isMulti={true}
        closeMenuOnSelect={false}
        name="test_6"
        options={options}
        placeholder="Search..."
        value={options[2]}
        aria-label="search"
      />
    </>
  ))
  .add('Async options', () => (
    <div style={{ width: '600px' }}>
      <h2>Search for</h2>
      <ul>
        <li>Bernard</li>
        <li>Holly</li>
        <li>Dennis</li>
      </ul>
      <label htmlFor="test_7">Search</label>
      <Typeahead
        isMulti={true}
        closeMenuOnSelect={false}
        name="test_7"
        loadOptions={getOptions}
        placeholder="Search advisers..."
        noOptionsMessage={() => <span>No advisers found</span>}
        aria-label="search"
      />
    </div>
  ))
  .add('Async options - pre-selected option', () => (
    <div style={{ width: '600px' }}>
      <h2>Search for</h2>
      <ul>
        <li>Bernard</li>
        <li>Holly</li>
        <li>Dennis</li>
      </ul>
      <label htmlFor="test_8">Search</label>
      <Typeahead
        isMulti={true}
        closeMenuOnSelect={false}
        name="test_8"
        loadOptions={getOptions}
        placeholder="Search advisers..."
        noOptionsMessage={() => <span>No advisers found</span>}
        value={asyncOptions[2]}
        aria-label="search"
      />
    </div>
  ))
