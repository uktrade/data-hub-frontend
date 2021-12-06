import React from 'react'
import { storiesOf } from '@storybook/react'

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
]

storiesOf('Typeahead2/Single Select', module).add('Standard options', () => (
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

storiesOf('Typeahead2/Multiselect', module).add('Standard options', () => (
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
