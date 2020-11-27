import { H3 } from '@govuk-react/heading'
import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Select } from '..'
import { COMPANY_LISTS__SELECT } from '../../actions'
import { state2props } from './state'

const StyledRoot = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledHeading = styled(H3)({
  flexGrow: 1,
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
      <StyledHeading level={1}>
        {pluralize('My companies list', listLength, true)}
      </StyledHeading>
      {listLength > 1 && (
        <Select
          label="View list"
          htmlFor="view-list"
          input={{
            onChange: (e) => onChange(e.target.value),
            initialValue: selectedId,
            id: 'view-list,',
          }}
        >
          {Object.entries(lists).map(([id, { name }]) => (
            <option key={id} value={id} aria-label={name}>
              {name}
            </option>
          ))}
        </Select>
      )}
    </StyledRoot>
  )
})

export default Header
