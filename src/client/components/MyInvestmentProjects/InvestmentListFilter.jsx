import React from 'react'
import { kebabCase } from 'lodash'

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
      <option value={id} aria-label={name} key={index} id={kebabCase(name)}>
        {name}
      </option>
    ))}
  </Select>
)

export default InvestmentListFilter
