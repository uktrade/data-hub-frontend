import React from 'react'
import styled from 'styled-components'
import { kebabCase } from 'lodash'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { Select } from '../../components'

const StyledSelect = styled(Select)({
  alignItems: 'flex-start',
  flexDirection: 'column',
  flex: '1 1',
  select: {
    width: '100%',
  },
  marginBottom: SPACING.SCALE_1,
  [MEDIA_QUERIES.DESKTOP]: {
    margin: `${SPACING.SCALE_1} ${SPACING.SCALE_2}`,
  },
})

const InvestmentListFilter = ({ initialValue, label, options, onChange }) => (
  <StyledSelect
    label={label}
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
  </StyledSelect>
)

export default InvestmentListFilter
