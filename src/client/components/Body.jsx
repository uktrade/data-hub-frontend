import React from 'react'
import styled from 'styled-components'

const StyledMain = styled('main')({
  backgroundColor: 'white',
  minHeight: '60vh',
  flexGrow: '1',
})
const StyledDiv = styled('div')({
  backgroundColor: 'white',
})

const Body = ({ children }) => (
  <StyledDiv className={'govuk-width-container'}>
    <StyledMain className={'govuk-main-wrapper'}>{children}</StyledMain>
  </StyledDiv>
)

export default Body
