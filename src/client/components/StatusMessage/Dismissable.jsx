import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StatusMessage from '.'
import TextLikeButton from '../TextLikeButton'
import { WHITE } from '../../utils/colours'

const StyledStatusMessage = styled(StatusMessage)({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  background: WHITE,
})

const DismissableStatusMessage = React.forwardRef(
  ({ children, onDismiss, ...props }, ref) => (
    <StyledStatusMessage {...props} ref={ref}>
      {children}
      <TextLikeButton tabIndex={0} onClick={onDismiss} aria-label="dismiss">
        ✕
      </TextLikeButton>
    </StyledStatusMessage>
  )
)

DismissableStatusMessage.propTypes = {
  onDismiss: PropTypes.func,
}

export default DismissableStatusMessage
