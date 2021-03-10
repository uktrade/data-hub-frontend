import React from 'react'
import PropTypes from 'prop-types'
import Input from '@govuk-react/input'
import VisuallyHidden from '@govuk-react/visually-hidden'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import SearchButton from '../SearchButton'

const StyledSearchContainer = styled('div')`
  position: relative;
  width: 100%;
`

const StyledSearchInput = styled(Input)`
  width: 100%;
  border: 0;
`

const Search = ({ csrfToken }) => (
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
      />
      <SearchButton />
    </StyledSearchContainer>
  </form>
)

Search.propTypes = {
  csrfToken: PropTypes.string.isRequired,
}

export default Search
