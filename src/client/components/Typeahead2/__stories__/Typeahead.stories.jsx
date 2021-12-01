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

storiesOf('Typeahead2/Multiselect', module).add(
  'Standard options with filtering',
  () => (
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
  )
)
