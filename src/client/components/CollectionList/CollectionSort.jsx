import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import qs from 'qs'

import styled from 'styled-components'
import { DARK_GREY } from '../../utils/colours'
import CollectionHeaderRow from './CollectionHeaderRow'
import RoutedSelect from '../RoutedSelect'

const StyledSpan = styled('span')`
  color: ${DARK_GREY};
`

const CollectionSort = ({ sortOptions, totalPages }) => {
  const actions = sortOptions ? (
    <RoutedSelect
      data-test="sortby"
      name="sortBy"
      qsParamName="sortby"
      label="Sort by"
    >
      {sortOptions.map(({ name, value }, i) => {
        return (
          <option value={value} key={i}>
            {name}
          </option>
        )
      })}
    </RoutedSelect>
  ) : null

  return (
    <CollectionHeaderRow actions={actions}>
      <Route>
        {({ location: { search } }) => {
          const searchParams = qs.parse(search.slice(1))
          return (
            <StyledSpan data-test="pagination-summary">
              Page {searchParams.page || 1} of {totalPages}
            </StyledSpan>
          )
        }}
      </Route>
    </CollectionHeaderRow>
  )
}

CollectionSort.propTypes = {
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  totalPages: PropTypes.number.isRequired,
}

export default CollectionSort
