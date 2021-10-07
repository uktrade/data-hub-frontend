import React from 'react'
import LoadingBox from '@govuk-react/loading-box'
import styled from 'styled-components'

const StyledContentWrapper = styled.div({
  position: 'relative',
})

const StyledErrorOverlay = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.85)',
})

export default ({ when, children }) => (
  <LoadingBox loading={when}>
    <StyledContentWrapper>
      {children}
      {/* <StyledErrorOverlay>{children}</StyledErrorOverlay> */}
    </StyledContentWrapper>
  </LoadingBox>
)
