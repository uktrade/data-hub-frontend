import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Select } from 'govuk-react'
import styled from 'styled-components'
import { get, kebabCase } from 'lodash'
import qs from 'qs'
import { BREAKPOINTS } from '@govuk-react/constants'

const StyledSelect = styled(Select)`
  select {
    @media (min-width: ${BREAKPOINTS.SMALLSCREEN}) {
      width: auto;
    }
    @media (min-width: ${BREAKPOINTS.TABLET}) {
      width: auto;
    }
    @media (min-width: ${BREAKPOINTS.DESKTOP}) {
      width: 150%;
    }
  }
  span {
    font-weight: bold;
    font-size: 17px;
  }
`

const TaskSelect = ({ label, options = [], qsParam }) => {
  const history = useHistory()
  const location = useLocation()
  const [value, setValue] = useState()

  const qsParams = qs.parse(location.search.slice(1))
  const initialValue = get(qsParams, qsParam, '')

  useEffect(() => setValue(initialValue), [initialValue])

  const onChange = (e) => {
    history.push({
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
