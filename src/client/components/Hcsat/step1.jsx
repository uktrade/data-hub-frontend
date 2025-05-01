import React from 'react'

import styled from 'styled-components'
import { FONT_WEIGHTS, MEDIA_QUERIES } from '@govuk-react/constants'

import SecondaryButton from '../SecondaryButton'

const StyledParagraph = styled('p')({
  display: 'block',
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: '16px',
  marginTop: '0px',
  marginBottom: '0px',
  alignSelf: 'start',
  [MEDIA_QUERIES.LARGESCREEN]: {
    alignSelf: 'center',
  },
})

const StyledWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  [MEDIA_QUERIES.LARGESCREEN]: {
    flexDirection: 'row',
  },
})

const SyledSecondaryButton = styled(SecondaryButton)({
  marginTop: '10px',
  marginBottom: '0px',
  [MEDIA_QUERIES.LARGESCREEN]: {
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '16px',
  },
})

export default function Step1({ handleUserNo, handleUserYes }) {
  return (
    <StyledWrapper>
      <StyledParagraph>Is this page useful?</StyledParagraph>

      <SyledSecondaryButton
        aria-label="This page is useful"
        onClick={handleUserYes}
        data-test="hcsat-page-is-useful"
      >
        Yes
      </SyledSecondaryButton>
      <SyledSecondaryButton
        aria-label="This page is not useful"
        onClick={handleUserNo}
        data-test="hcsat-page-is-not-useful"
      >
        No
      </SyledSecondaryButton>
    </StyledWrapper>
  )
}
