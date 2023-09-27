import React from 'react'
import PropTypes from 'prop-types'
import { SPACING } from '@govuk-react/constants'
import Input from '@govuk-react/input'
import styled from 'styled-components'
import Main from '@govuk-react/main'

import { BLUE, DARK_GREY, GREY_3_LEGACY } from '../../utils/colours'
import urls from '../../../lib/urls'
import SearchButton from '../SearchButton'

import FlashMessages from '../LocalHeader/FlashMessages'

const StyledSearchContainer = styled('div')`
  position: relative;
  width: 100%;
  margin-top: 10px;
`

const StyledSearchInput = styled(Input)`
  border: 2px solid #0b0c0c;
  width: 100%;
  padding-left: ${SPACING.SCALE_3};
`
const StyledMain = styled(Main)`
  padding-top: 40px;
`

const StyledLabel = styled('label')({
  marginTop: 2 * 20.5,
  fontSize: 19,
  color: DARK_GREY,
})

const StyledHeader = styled('div')`
  padding-bottom: ${SPACING.SCALE_5};
  background-color: ${GREY_3_LEGACY};
  padding-top: ${SPACING.SCALE_6};
`

const SearchLocalHeader = ({ csrfToken, flashMessages }) => (
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
      <FlashMessages flashMessages={flashMessages} />
      <StyledMain>
        <StyledLabel htmlFor="search-input">
          Search for company, contact, event, investment project or OMIS order
        </StyledLabel>
        <StyledSearchContainer role="search">
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
