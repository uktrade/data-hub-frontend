import React from 'react'

import { Select } from '../../components'

const InvestmentListSort = ({ initialValue, options, onChange }) => (
  <Select
    label="Sort by"
    input={{
      onChange,
      initialValue,
    }}
  >
    {options.map(({ value, name }, index) => (
      <option value={value} aria-label={name} key={index} id={value}>
        {name}
      </option>
    ))}
  </Select>
)

export default InvestmentListSort
