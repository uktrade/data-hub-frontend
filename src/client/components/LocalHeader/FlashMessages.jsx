import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import {
  ERROR_COLOUR,
  BLUE,
  BUTTON_COLOUR,
  ORANGE,
  BLACK,
  WHITE,
} from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import UnorderedList from '@govuk-react/unordered-list'
import StatusMessage from '../../components/StatusMessage'
import { getMessages, clearMessages } from '../../utils/flash-messages'

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
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledStatusMessage = styled(StatusMessage)`
  margin-top: ${SPACING.SCALE_3};
  background-color: ${WHITE};
`

const messageColours = {
  info: BLUE,
  success: BUTTON_COLOUR,
  warning: ORANGE,
  error: ERROR_COLOUR,
  muted: BLACK,
}

export const FlashMessagesStateless = ({ flashMessages }) => {
  /*
  Flash message component used just for presentation which does not interact with
  the session storage. Takes an object of flash messages as a prop.
  */
  return !isEmpty(flashMessages) ? (
    <UnorderedList listStyleType="none" data-test="flash">
      {Object.entries(flashMessages).map(([type, messages]) => {
        /*
        Example "success:with-body" -  If the string you pass in the first argument "type"
        has a colon then the message argument accepts two props in an object, one for the heading
        and one for the body. The first part of the string is used to indicate colour, success - green, info - blue
        */
        const parts = String(type).split(':')
        return parts.length > 1
          ? messages.map(({ body, heading }) => (
              <li key={body}>
                <StyledStatusMessage colour={messageColours[parts[0]]}>
                  <StyledHeading>{heading}</StyledHeading>
                  <StyledBody dangerouslySetInnerHTML={{ __html: body }} />
                </StyledStatusMessage>
              </li>
            ))
          : messages.map((body, i) => (
              <li key={i}>
                <StyledStatusMessage colour={messageColours[type]}>
                  <StyledMessage dangerouslySetInnerHTML={{ __html: body }} />
                </StyledStatusMessage>
              </li>
            ))
      })}
    </UnorderedList>
  ) : null
}

const FlashMessages = ({ flashMessages }) => {
  /*
  Flash message component that will get messages from either session storage,
  or via the flashMessages prop.
  */
  const flashMessagesFromStorage = getMessages()
  const messages = !isEmpty(flashMessages)
    ? flashMessages
    : flashMessagesFromStorage
  clearMessages()
  return <FlashMessagesStateless flashMessages={messages} />
}

const flashMessagePropTypes = {
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
  }),
}

FlashMessagesStateless.propTypes = flashMessagePropTypes
FlashMessages.propTypes = flashMessagePropTypes

export default FlashMessages
