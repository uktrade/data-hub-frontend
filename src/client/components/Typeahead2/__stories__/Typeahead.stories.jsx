import React from 'react'
import { storiesOf } from '@storybook/react'

import Typeahead from '../Typeahead'

const options = [
  { value: '0001', label: 'Apple' },
  { value: '1234', label: 'Banana' },
  { value: '5678', label: 'Blueberry' },
  { value: '9876', label: 'Blackberry' },
  { value: '9999', label: 'Orange' },
]

storiesOf('Typeahead2/Multiselect', module).add('Standard options', () => (
  <>
    <Typeahead
      id="typeahead-1"
      isMulti={false}
      closeMenuOnSelect={false}
      name="multiselect"
      options={options}
      placeholder="Search..."
      label="Pick a fruit"
    />
  </>
))
