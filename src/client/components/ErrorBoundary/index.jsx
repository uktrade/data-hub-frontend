import React from 'react'
import styled from 'styled-components'
import * as sentry from '@sentry/browser'
import { TEXT_COLOUR, ERROR_COLOUR } from 'govuk-colours'
import { H2 } from '@govuk-react/heading'
import {
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants'
import config from '../../config'

const StyledRoot = styled.div({
  textAlign: 'center',
  width: '98%',
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

const ImageText = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: undefined }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error) {
    sentry.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      const { isProd } = config
      return (
        <StyledRoot data-test="error-message">
          <H2 size="MEDIUM">
            <ImageText>
              <span>
                <img
                  src="/images/error-100x100.png"
                  alt="Unhandled Error occured"
                />
              </span>
              <span>Oops, something went wrong.</span>
            </ImageText>
          </H2>
          <p>
            Error:{' '}
            {isProd || !this.state?.error?.message
              ? 'We’re working on it!'
              : this.state?.error?.message}
          </p>
        </StyledRoot>
      )
    }

    return this.props.children
  }
}

export const withErrorBoundary = (Component) => {
  const Wrapped = (props) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  )

  const name = Component.displayName || Component.name
  Wrapped.displayName = name
    ? `WithErrorBoundary(${name})`
    : 'WithErrorBoundary'

  return Wrapped
}

export default ErrorBoundary
