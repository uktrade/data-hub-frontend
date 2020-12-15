import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'

import ButtonLink from '../ButtonLink'

const StyledButtonLink = styled(ButtonLink)`
  font-size: ${FONT_SIZE.SIZE_16};
  margin: 0;
  display: inline-block;
  padding: 0;
  width: auto;
  border: none;
  vertical-align: baseline;
  &::before {
    display: none;
  }
`

const ReadMore = ({ text, count = 255 }) => {
  const [showingAll, setIsShowingAll] = useState(false)
  if (!text) {
    return null
  }
  if (text.length < count) {
    return text
  }
  return (
    <>
      {showingAll
        ? text
        : text.slice(0, count).split(' ').slice(0, -1).join(' ') + '...'}{' '}
      <StyledButtonLink onClick={() => setIsShowingAll(!showingAll)}>
        {showingAll ? 'Show Less' : 'Read More'}
      </StyledButtonLink>
    </>
  )
}

ReadMore.propTypes = {
  text: PropTypes.string.isRequired,
  count: PropTypes.number,
}

export default ReadMore
