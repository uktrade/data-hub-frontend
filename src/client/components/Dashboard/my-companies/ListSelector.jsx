import React from 'react'
import styled from 'styled-components'
import { H2, H3 } from '@govuk-react/heading'
import Link from '@govuk-react/link'
import Select from '@govuk-react/select'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import useMyCompaniesContext from './useMyCompaniesContext'
import { LIST_CHANGE } from './constants'

const StyledRoot = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledHeadline = styled(H2)({
  flexGrow: 1,
})

const StyledListName = styled(H3)({
  marginRight: SPACING.SCALE_2,
})

const StyledSelect = styled(Select)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  marginRight: SPACING.SCALE_2,
  span: {
    marginRight: SPACING.SCALE_2,
  },
  // We need to override the select style because it has a hardcoded 50% width.
  select: {
    width: 'initial',
    minWidth: 200,
  },
})

export default () => {
  const {
    state: { lists, selectedIdx },
    dispatch,
    deleteListPropsAccessor = () => ({}),
  } = useMyCompaniesContext()
  return (
    <StyledRoot>
      <StyledHeadline size={LEVEL_SIZE[3]}>My Companies Lists</StyledHeadline>
      {lists.length ? (
        <>
          {lists.length === 1 ? (
            <StyledListName>{lists[0].name}</StyledListName>
          ) : (
            <>
              <StyledSelect
                label="View list"
                input={{
                  onChange: (e) =>
                    dispatch({
                      type: LIST_CHANGE,
                      idx: e.target.value,
                    }),
                }}
              >
                {/* eslint-disable react/no-array-index-key */}
                {lists.map(({ name }, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </StyledSelect>
            </>
          )}
          <Link {...deleteListPropsAccessor(lists[selectedIdx])}>
            Delete this list
          </Link>
        </>
      ) : null}
    </StyledRoot>
  )
}
