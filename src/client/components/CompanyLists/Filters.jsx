import { SPACING } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import { SelectInput } from '@govuk-react/select'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { GREY_4 } from '../../../client/utils/colours'
import InlineLabel from '../InlineLabel'
import { MEDIA_QUERIES } from '../../utils/responsive'
import { COMPANY_LISTS__FILTER, COMPANY_LISTS__ORDER } from '../../actions'
import { state2props } from './state'

export const ALPHABETICAL = 'alphabetical'
export const RECENT = 'recent'
export const LEAST_RECENT = 'least-recent'

const StyledRoot = styled(GridRow)({
  background: GREY_4,
  padding: `${SPACING.SCALE_2} ${SPACING.SCALE_3}`,
  flexWrap: 'wrap',
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    flexWrap: 'nowrap',
  },
})

const StyledCol = styled(GridCol)({
  paddingLeft: 0,
  paddingRight: 0,
  '&:not(:first-child)': {
    paddingTop: SPACING.SCALE_2,
    [MEDIA_QUERIES.LARGE_DESKTOP]: {
      paddingTop: 0,
      marginLeft: SPACING.SCALE_2,
    },
  },
})

const StyledInput = styled(Input)({
  width: '100%',
  [MEDIA_QUERIES.LARGESCREEN]: {
    width: 200,
  },
})

const StyledSelect = styled(SelectInput)({
  width: '100%',
  [MEDIA_QUERIES.LARGESCREEN]: { width: 'auto' },
})

const Filters = ({
  query,
  orderBy,
  onSearch,
  onOrderChange,
  companyNameId = 'company-name',
  sortById = 'sort-by',
}) => (
  <StyledRoot>
    <StyledCol>
      <InlineLabel text="Search this list" name={companyNameId}>
        <StyledInput
          // We need to default to empty string here,
          // only to prevent React's uncontrolled input warning.
          value={query || ''}
          placeholder="Company name"
          id={companyNameId}
          onChange={(e) => onSearch(e.target.value)}
        />
      </InlineLabel>
    </StyledCol>
    <StyledCol>
      <InlineLabel text="Sort by" justifyRight={true} name={sortById}>
        <StyledSelect
          value={orderBy}
          id={sortById}
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <option value={RECENT} aria-label="recent interaction">
            Recent interaction
          </option>
          <option value={LEAST_RECENT} aria-label="least recent interaction">
            Least recent interaction
          </option>
          <option value={ALPHABETICAL} aria-label="company name a to z">
            Company name A-Z
          </option>
        </StyledSelect>
      </InlineLabel>
    </StyledCol>
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
