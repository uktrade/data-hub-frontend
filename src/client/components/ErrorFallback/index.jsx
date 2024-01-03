import React from 'react'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import {
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants'

import { TEXT_COLOUR, ERROR_COLOUR } from '../../../client/utils/colours'
import config from '../../config'

import FormActions from '../Form/elements/FormActions'
import SecondaryButton from '../SecondaryButton'

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

const StyledSecondaryButton = styled(SecondaryButton)({
  marginBottom: 0,
})

function ErrorFallback({ error, resetErrorBoundary }) {
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
        {isProd || !error.message ? 'We’re working on it!' : error.message}
      </p>
      {resetErrorBoundary && (
        <FormActions>
          <StyledSecondaryButton onClick={resetErrorBoundary}>
            Retry
          </StyledSecondaryButton>
        </FormActions>
      )}
    </StyledRoot>
  )
}

export default ErrorFallback
