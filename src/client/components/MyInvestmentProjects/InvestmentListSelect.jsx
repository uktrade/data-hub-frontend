import React from 'react'
import styled from 'styled-components'
import { kebabCase } from 'lodash'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { Select } from '..'

const StyledSelect = styled(Select)({
  alignItems: 'flex-start',
  flexDirection: 'column',
  flex: '1 1',
  select: {
    width: '100%',
    minWidth: 170,
  },
  marginBottom: SPACING.SCALE_1,
  [MEDIA_QUERIES.DESKTOP]: {
    margin: SPACING.SCALE_1,
  },
})

const InvestmentListSelect = ({
  initialValue,
  label,
  options,
  onChange,
  ...props
}) => (
  <StyledSelect
    label={label}
    input={{
      onChange,
      initialValue,
    }}
    {...props}
  >
    {options.map(({ id, name }, index) => (
      <option value={id} aria-label={name} key={index} id={kebabCase(name)}>
        {name}
      </option>
    ))}
  </StyledSelect>
)

export default InvestmentListSelect
