import { LEVEL_SIZE, SPACING } from '@govuk-react/constants'
import { H2 } from '@govuk-react/heading'
import Select from '@govuk-react/select'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { COMPANY_LIST_2__SELECT } from '../../actions'
import { state2props } from './state'

const StyledRoot = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledHeading = styled(H2)({
  flexGrow: 1,
})

const StyledSelect = styled(Select)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  marginRight: 0,
  span: {
    marginRight: SPACING.SCALE_2,
  },
  // We need to override the select style because it has a hardcoded 50% width.
  select: {
    width: 'initial',
    minWidth: 200,
  },
})

export const Header = connect(
  state2props,
  (dispatch) => ({
    onChange: (id) =>
      dispatch({
        type: COMPANY_LIST_2__SELECT,
        id,
      }),
  })
)(({ selectedId, lists, onChange }) => (
  <StyledRoot>
    <StyledHeading size={LEVEL_SIZE[3]}>My companies lists</StyledHeading>
    {Object.keys(lists).length > 1 && (
      <StyledSelect
        label="View list"
        input={{
          onChange: (e) => onChange(e.target.value),
          value: selectedId,
        }}
      >
        {Object.entries(lists).map(([id, { title }]) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </StyledSelect>
    )}
  </StyledRoot>
))

export default Header
