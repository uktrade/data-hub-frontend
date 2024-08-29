import React from 'react'
import PropTypes from 'prop-types'
import VisuallyHidden from '@govuk-react/visually-hidden'
import { SPACING } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import styled from 'styled-components'
import { isEmpty, omitBy } from 'lodash'
import qs from 'qs'
import { useLocation } from 'react-router-dom'

import urls from '../../../lib/urls'
import SearchButton from '../SearchButton'
import { BLACK } from '../../utils/colours'

const StyledSearchContainer = styled('div')`
  position: relative;
  width: 100%;
`

const StyledSearchInput = styled(Input)`
  border: 0;
  width: 100%;
  padding-left: ${SPACING.SCALE_3};
  outline: ${({ showBorder }) => (showBorder ? `2px solid ${BLACK}` : 0)};
  padding-bottom: ${({ showBorder }) => (showBorder ? -SPACING.SCALE_1 : 0)};
`

const getSearchTerm = (location) => {
  const queryString = location.search.slice(1)
  const queryParams = omitBy({ ...qs.parse(queryString) }, isEmpty)
  return queryParams.term
}

const Search = ({ csrfToken, buttonColour = BLACK, showBorder = false }) => {
  const location = useLocation()

  return (
    <form
      method="GET"
      action={`${urls.search.type('companies')}?_csrf=${csrfToken}`}
    >
      <StyledSearchContainer role="search">
        <label htmlFor="search-input">
          <VisuallyHidden>Input your search term</VisuallyHidden>
        </label>
        <StyledSearchInput
          name="term"
          type="text"
          id="search-input"
          placeholder="Search Data Hub"
          defaultValue={getSearchTerm(location)}
          showBorder={showBorder}
        />
        <SearchButton backgroundColour={buttonColour} />
      </StyledSearchContainer>
    </form>
  )
}

Search.propTypes = {
  csrfToken: PropTypes.string.isRequired,
}

export default Search
