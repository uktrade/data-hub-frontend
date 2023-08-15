import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Select } from 'govuk-react'
import styled from 'styled-components'
import { get, kebabCase } from 'lodash'
import qs from 'qs'

const StyledSelect = styled(Select)({
  select: {
    width: '100%',
  },
})

const ExportSelect = ({ label, options = [], qsParam }) => {
  const history = useHistory()
  const location = useLocation()

  const qsParams = qs.parse(location.search.slice(1))
  const initialValue = get(qsParams, qsParam, '')

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
        onChange,
        initialValue,
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

export default ExportSelect
