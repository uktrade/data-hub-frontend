import { H2 } from '@govuk-react/heading'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Select from '../Select'
import { COMPANY_LISTS__SELECT } from '../../actions'
import { state2props } from './state'

const StyledRoot = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  marginBottom: SPACING.SCALE_2,
})

const StyledHeading = styled(H2)({
  flexGrow: 1,
  fontSize: 24,
})

const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  [theme?.toHorizontalMediaQuery || MEDIA_QUERIES.TABLET]: {
    width: 'auto',
    marginLeft: SPACING.SCALE_2,
  },
}))

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
      <StyledHeading>
        {pluralize('My companies list', listLength, true)}
      </StyledHeading>
      {listLength > 1 && (
        <StyledSelect
          label="View list"
          htmlFor="view-list"
          input={{
            onChange: (e) => onChange(e.target.value),
            initialValue: selectedId,
            id: 'view-list',
          }}
        >
          {Object.entries(lists).map(([id, { name }]) => (
            <option key={id} value={id} aria-label={name}>
              {name}
            </option>
          ))}
        </StyledSelect>
      )}
    </StyledRoot>
  )
})

export default Header
