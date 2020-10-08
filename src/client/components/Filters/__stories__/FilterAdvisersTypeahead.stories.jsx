/* eslint "react/destructuring-assignment": 0, react/prop-types: 0 */

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import FilterAdvisersTypeahead from '../elements/FilterAdvisersTypeahead'
import exampleReadme from '../elements/FilterAdvisersTypeahead/example.md'
import usageReadme from '../elements/FilterAdvisersTypeahead/usage.md'

const asyncOptions = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Holly Collins - Heart of the South West LEP',
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

const SearchMesssage = () => <p>Try searching for Bernard, Holly or Dennis</p>

const FilterAdvisersTypeaheadWithState = (props) => {
  const [advisers, setAdvisers] = useState([])

  const onChange = (adviser) => {
    setAdvisers(adviser)
  }

  return (
    <FilterAdvisersTypeahead
      onChange={onChange}
      selectedAdvisers={advisers}
      {...props}
    />
  )
}

const loadOptions = () =>
  new Promise((resolve) => setTimeout(resolve, 1000, asyncOptions))

storiesOf('Filters/Adviser typeahead', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <div style={{ width: '600px' }}>
      <SearchMesssage />
      <FilterAdvisersTypeaheadWithState
        label="Advisers"
        isMulti={true}
        closeMenuOnSelect={false}
        name="example-1"
        loadOptions={loadOptions}
        placeholder="Search advisers..."
        noOptionsMessage={() => <span>No advisers found</span>}
        taskProps={{
          name: 'task name 1',
          id: 'id1',
        }}
      />
    </div>
  ))
  .add('With hint', () => (
    <div style={{ width: '600px' }}>
      <SearchMesssage />
      <FilterAdvisersTypeaheadWithState
        label="Advisers"
        hint="Some hint"
        isMulti={true}
        closeMenuOnSelect={false}
        name="example-2"
        loadOptions={loadOptions}
        placeholder="Search advisers..."
        noOptionsMessage={() => <span>No advisers found</span>}
        taskProps={{
          name: 'task name 2',
          id: 'id2',
        }}
      />
    </div>
  ))
  .add('Pre-selected option', () => (
    <div style={{ width: '600px' }}>
      <SearchMesssage />
      <FilterAdvisersTypeaheadWithState
        label="Advisers"
        isMulti={true}
        closeMenuOnSelect={false}
        name="example-3"
        loadOptions={loadOptions}
        placeholder="Search advisers..."
        noOptionsMessage={() => <span>No advisers found</span>}
        selectedAdvisers={asyncOptions[2]}
        taskProps={{
          name: 'task name 3',
          id: 'id3',
        }}
      />
    </div>
  ))
