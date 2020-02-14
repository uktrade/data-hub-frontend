import { GREY_4 } from 'govuk-colours'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import { SelectInput } from '@govuk-react/select'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import InlineLabel from '../InlineLabel'
import { COMPANY_LISTS__FILTER, COMPANY_LISTS__ORDER } from '../../actions'
import { state2props } from './state'

export const ALPHABETICAL = 'alphabetical'
export const RECENT = 'recent'
export const LEAST_RECENT = 'least-recent'

const StyledRoot = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  background: GREY_4,
  padding: SPACING.SCALE_2,
})

const StyledInput = styled(Input)({
  width: 200,
  marginRight: SPACING.SCALE_6,
})

const StyledSelect = styled(SelectInput)({
  [MEDIA_QUERIES.LARGESCREEN]: { width: 'auto' },
})

const Filters = ({ query, orderBy, onSearch, onOrderChange }) => (
  <StyledRoot>
    <InlineLabel text="Search this list">
      <StyledInput
        // We need to default to empty string here,
        // only to prevent React's uncontrolled input warning.
        value={query || ''}
        placeholder="Company name"
        onChange={(e) => onSearch(e.target.value)}
      />
    </InlineLabel>
    <InlineLabel text="Sort by">
      <StyledSelect
        value={orderBy}
        onChange={(e) => onOrderChange(e.target.value)}
      >
        <option value={RECENT}>Recent interaction</option>
        <option value={LEAST_RECENT}>Least recent interaction</option>
        <option value={ALPHABETICAL}>Company name A-Z</option>
      </StyledSelect>
    </InlineLabel>
  </StyledRoot>
)

export default connect(state2props, (dispatch) => ({
  onSearch: (query) =>
    dispatch({
      type: COMPANY_LISTS__FILTER,
      query,
    }),
  onOrderChange: (orderBy) =>
    dispatch({
      type: COMPANY_LISTS__ORDER,
      orderBy,
    }),
}))(Filters)
