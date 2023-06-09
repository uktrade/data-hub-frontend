import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import { get, kebabCase } from 'lodash'
import qs from 'qs'

import { Select } from '../../../components'

const StyledSelect = styled(Select)(() => ({
  alignItems: 'flex-start',
  flexDirection: 'column',
  flex: '1 1',
  select: {
    width: '100%',
    minWidth: 170,
    maxHeight: 36,
  },
  marginBottom: SPACING.SCALE_1,
  [MEDIA_QUERIES.DESKTOP]: {
    margin: SPACING.SCALE_1,
  },
}))

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
