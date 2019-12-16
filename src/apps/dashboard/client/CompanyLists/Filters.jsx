import { GREY_3 } from 'govuk-colours'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import { SelectInput } from '@govuk-react/select'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import InlineLabel from './InlineLabel'

const StyledRoot = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  background: GREY_3,
  padding: SPACING.SCALE_2,
})

const StyledInput = styled(Input)({
  width: 200,
  marginRight: SPACING.SCALE_6,
})

const StyledSelect = styled(SelectInput)({
  [MEDIA_QUERIES.LARGESCREEN]: { width: 'auto' },
})

const Filters = ({ onSearch, onOrderChange }) =>
  <StyledRoot>
    <InlineLabel text="Search this list">
      <StyledInput
        placeholder="Company name"
        onChange={e => onSearch(e.target.value)}
        // onChange={e => dispatch({
        //   type: actions.FILTER_CHANGE,
        //   filter: e.target.value,
        // })}
      />
    </InlineLabel>
    <InlineLabel text="Sort by">
      <StyledSelect
        // onChange={e => dispatch({
        //   type: actions.ORDER_CHANGE,
        //   sortBy: e.target.value,
        // })}
        onChange={e => onOrderChange(e.target.value)}
      >
        <option value="recent">Recent interaction</option>
        <option value="least-recent">Least recent interaction</option>
        <option value="alphabetical">Company name A-Z</option>
      </StyledSelect>
    </InlineLabel>
  </StyledRoot>

Filters.propTypes = {
  onSearch: PropTypes.func,
  onOrderChange: PropTypes.func,
}

export default Filters
