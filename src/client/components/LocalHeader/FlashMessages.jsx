import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

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
import { state2props } from './state'
import {
  FLASH_MESSAGE__CLEAR_FROM_STATE,
  FLASH_MESSAGE__GET_FROM_SESSION,
} from '../../actions'

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

const FlashMessages = ({
  // Can be passed in as prop or from redux store
  flashMessages,
  getFlashMessages,
  clearFlashMessages,
}) => {
  useEffect(() => {
    getFlashMessages()
    return () => clearFlashMessages()
  }, [])
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

FlashMessages.propTypes = flashMessagePropTypes

export default connect(state2props, (dispatch) => ({
  getFlashMessages: () => {
    dispatch({
      type: FLASH_MESSAGE__GET_FROM_SESSION,
    })
  },
  clearFlashMessages: () => {
    dispatch({
      type: FLASH_MESSAGE__CLEAR_FROM_STATE,
    })
  },
}))(FlashMessages)
