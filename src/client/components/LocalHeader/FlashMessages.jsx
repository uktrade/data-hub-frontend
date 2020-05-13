import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ERROR_COLOUR, BLUE, BUTTON_COLOUR, ORANGE, BLACK } from 'govuk-colours'
import { FONT_WEIGHTS } from '@govuk-react/constants/lib/typography'
import { FONT_SIZE } from '@govuk-react/constants'
import UnorderedList from '@govuk-react/unordered-list'
import { StatusMessage } from 'data-hub-components'

const StyledBody = styled('p')`
  margin-bottom: 0;
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledHeading = styled('h2')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-top: 0;
`

const StyledMessage = styled('p')`
  margin: 0;
  font-size: ${FONT_SIZE.SIZE_20};
`

const messageColours = {
  info: BLUE,
  success: BUTTON_COLOUR,
  warning: ORANGE,
  error: ERROR_COLOUR,
  muted: BLACK,
}

const FlashMessages = ({ flashMessages }) => (
  <UnorderedList listStyleType="none" data-auto-id="flash">
    {Object.entries(flashMessages).map(([type, message]) => {
      const parts = String(type).split(':')
      return parts.length > 1
        ? message.map((message) => (
            <li key={message.body}>
              <StatusMessage colour={messageColours[parts[0]]}>
                <StyledHeading>{message.heading}</StyledHeading>
                <StyledBody
                  dangerouslySetInnerHTML={{ __html: message.body }}
                />
              </StatusMessage>
            </li>
          ))
        : message.map((message) => (
            <li key={message}>
              <StatusMessage colour={messageColours[type]}>
                <StyledMessage dangerouslySetInnerHTML={{ __html: message }} />
              </StatusMessage>
            </li>
          ))
    })}
  </UnorderedList>
)

FlashMessages.propTypes = {
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }).isRequired,
}

export default FlashMessages
