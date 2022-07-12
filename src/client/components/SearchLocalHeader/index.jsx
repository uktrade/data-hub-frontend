import React from 'react'
import PropTypes from 'prop-types'
import VisuallyHidden from '@govuk-react/visually-hidden'
import { SPACING } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import styled from 'styled-components'
import Main from '@govuk-react/main'

import urls from '../../../lib/urls'
import SearchButton from '../SearchButton'
import { BLUE } from 'govuk-colours'

const GREY_LEGACY_HEADER = '#dee0e2'
const GREY_LEGACY_PLACEHOLDER_TEXT = '#505a5f'

const StyledSearchContainer = styled('div')`
  position: relative;
  width: 100%;
`

const StyledSearchInput = styled(Input)`
  border: 2px solid #0b0c0c;
  width: 100%;
  padding-left: ${SPACING.SCALE_3};
`
const StyledMain = styled(Main)`
  padding-top: 0;
`

const StyledDiv = styled('div')({
  marginTop: 2 * 20.5,
  marginBottom: 10,
  fontSize: 19,
  color: GREY_LEGACY_PLACEHOLDER_TEXT,
})

const StyledHeader = styled('div')`
  padding-bottom: ${SPACING.SCALE_5};
  background-color: ${GREY_LEGACY_HEADER};
  padding-top: ${SPACING.SCALE_6};
`

const SearchLocalHeader = ({ csrfToken }) => (
  <StyledHeader
    aria-label="local header"
    data-auto-id="localHeader"
    data-test="localHeader"
    role="region"
  >
    <form
      method="GET"
      action={`${urls.search.type('companies')}?_csrf=${csrfToken}`}
    >
      <StyledMain>
        <StyledDiv>
          Search for company, contact, event, investment project or OMIS order
        </StyledDiv>
        <StyledSearchContainer role="search">
          <label htmlFor="search-input">
            <VisuallyHidden>Input your search term</VisuallyHidden>
          </label>
          <StyledSearchInput
            name="term"
            type="text"
            id="search-input"
            placeholder="Enter your search term(s)"
          />
          <SearchButton backgroundColour={BLUE} />
        </StyledSearchContainer>
      </StyledMain>
    </form>
  </StyledHeader>
)

SearchLocalHeader.propTypes = {
  csrfToken: PropTypes.string.isRequired,
}

export default SearchLocalHeader
