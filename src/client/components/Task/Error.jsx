import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import {
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  FOCUS_WIDTH,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'
import { isString, isArray } from 'lodash'
import { IconImportant } from '@govuk-react/icons'

import InlineIcon from '../InlineIcon'
import FormActions from '../Form/elements/FormActions'
import SecondaryButton from '../SecondaryButton'
import { TEXT_COLOUR, ERROR_COLOUR, FOCUS_COLOUR } from '../../utils/colours'

const StyledRoot = styled.div(
  {
    color: TEXT_COLOUR,
    background: 'white',
    wordWrap: 'break-word',
    padding: RESPONSIVE_4.mobile,
    border: `${BORDER_WIDTH_MOBILE} solid ${ERROR_COLOUR}`,
    '&:focus': {
      outline: `${FOCUS_WIDTH} solid ${FOCUS_COLOUR}`,
      outlineOffset: '0',
    },
    [MEDIA_QUERIES.LARGESCREEN]: {
      padding: RESPONSIVE_4.tablet,
      border: `${BORDER_WIDTH} solid ${ERROR_COLOUR}`,
    },
  },
  spacing.withWhiteSpace({ marginBottom: 6 })
)

const StyledSecondaryButton = styled(SecondaryButton)({
  marginBottom: 0,
})

const Err = ({ errorMessage, retry, dismiss, noun }) => (
  <StyledRoot data-test="error-dialog">
    <H2 size="MEDIUM">Could not load {noun}</H2>
    {isString(errorMessage) && <p>Error: {errorMessage}</p>}
    {isArray(errorMessage) &&
      errorMessage.map((error) => <p key={error}>{error}</p>)}
    {retry && (
      <FormActions>
        <StyledSecondaryButton onClick={retry}>Retry</StyledSecondaryButton>
        {dismiss && (
          <StyledSecondaryButton onClick={dismiss}>
            Dismiss
          </StyledSecondaryButton>
        )}
      </FormActions>
    )}
  </StyledRoot>
)

Err.propTypes = {
  noun: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  retry: PropTypes.func,
  dismiss: PropTypes.func,
}

Err.Inline = ({ retry, noun }) => (
  <span style={{ color: ERROR_COLOUR }}>
    <InlineIcon>
      <IconImportant />
    </InlineIcon>{' '}
    Could not load {noun}
    {retry && (
      <>
        {' '}
        <SecondaryButton.Inline onClick={retry}>Retry</SecondaryButton.Inline>
      </>
    )}
  </span>
)

export default Err
