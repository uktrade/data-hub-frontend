import { LEVEL_SIZE, SPACING } from '@govuk-react/constants'
import { H2 } from '@govuk-react/heading'
import Select from '@govuk-react/select'
import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { COMPANY_LISTS__SELECT } from '../../actions'
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

export const Header = connect(state2props, (dispatch) => ({
  onChange: (id) =>
    dispatch({
      type: COMPANY_LISTS__SELECT,
      id,
    }),
}))(({ selectedId, lists, onChange }) => {
  const listLength = Object.keys(lists).length
  return (
    <StyledRoot>
      <StyledHeading size={LEVEL_SIZE[3]}>
        {pluralize('My companies list', listLength, true)}
      </StyledHeading>
      {listLength > 1 && (
        <StyledSelect
          label="View list"
          input={{
            onChange: (e) => onChange(e.target.value),
            value: selectedId,
          }}
        >
          {Object.entries(lists).map(([id, { name }]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </StyledSelect>
      )}
    </StyledRoot>
  )
})

export default Header
