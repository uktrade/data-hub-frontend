import React from 'react'
import PropTypes from 'prop-types'
import VisuallyHidden from '@govuk-react/visually-hidden'
import { SPACING } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import SearchButton from '../SearchButton'

const StyledSearchContainer = styled('div')`
  position: relative;
  width: 100%;
`

const StyledSearchInput = styled(Input)`
  border: 0;
  width: 100%;
  padding-left: ${SPACING.SCALE_3};
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
