import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom-v5-compat'
import { Select } from 'govuk-react'
import styled from 'styled-components'
import { get, kebabCase } from 'lodash'
import qs from 'qs'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

const StyledSelect = styled(Select)({
  select: {
    width: '100%',
  },
  span: {
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZE.SIZE_16,
  },
})

const TaskSelect = ({ label, options = [], qsParam }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState()

  const qsParams = qs.parse(location.search.slice(1))
  const initialValue = get(qsParams, qsParam, '')

  useEffect(() => setValue(initialValue), [initialValue])

  const onChange = (e) => {
    navigate({
      search: qs.stringify({
        ...qsParams,
        [qsParam]: e.target.value,
        page: 1,
      }),
    })
  }

  return (
    <StyledSelect
      label={label}
      data-test={kebabCase(`${qsParam}-select`)}
      input={{
        onChange: (e) => {
          setValue(e.target.value)
          onChange(e)
        },
        value,
      }}
    >
      {options.map(({ value, label }, index) => (
        <option
          value={value}
          aria-label={label}
          key={index}
          id={kebabCase(label)}
        >
          {label}
        </option>
      ))}
    </StyledSelect>
  )
}

export default TaskSelect
