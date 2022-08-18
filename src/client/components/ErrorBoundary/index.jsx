import React from 'react'
import styled from 'styled-components'
import { TEXT_COLOUR, ERROR_COLOUR } from 'govuk-colours'
import { H2 } from '@govuk-react/heading'
import {
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants'

const StyledRoot = styled.div({
  width: '60%',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: RESPONSIVE_4.mobile,
  marginBottom: RESPONSIVE_4.mobile,
  color: TEXT_COLOUR,
  background: 'white',
  padding: RESPONSIVE_4.mobile,
  border: `${BORDER_WIDTH_MOBILE} solid ${ERROR_COLOUR}`,
  [MEDIA_QUERIES.LARGESCREEN]: {
    padding: RESPONSIVE_4.tablet,
    border: `${BORDER_WIDTH} solid ${ERROR_COLOUR}`,
  },
})

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development'
      return (
        <StyledRoot data-test="error-message">
          <H2 size="MEDIUM">Oops Something went wrong.</H2>
          <p>
            Error:{' '}
            {isDev
              ? this.state.error.message
              : 'We are working on getting this fixed as soon as we can.'}
          </p>
        </StyledRoot>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
