import React from 'react'

import { Select } from '../../components'

const InvestmentListFilter = ({ initialValue, options, onChange }) => (
  <Select
    label="Stage"
    input={{
      onChange,
      initialValue,
    }}
  >
    {options.map(({ id, name }, index) => (
      <option value={id} aria-label={name} key={index}>
        {name}
      </option>
    ))}
  </Select>
)

export default InvestmentListFilter
