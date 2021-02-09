import React from 'react'

import { Select } from '../../components'

const InvestmentListSort = ({ options, onChange }) => (
  <Select
    label="Sort by"
    input={{
      onChange,
    }}
  >
    {options.map(({ value, name }, index) => (
      <option value={value} aria-label={name} key={index}>
        {name}
      </option>
    ))}
  </Select>
)

export default InvestmentListSort
