import React from 'react'
import LoadingBox from '@govuk-react/loading-box'
import styled from 'styled-components'

const StyledRoot = styled.div({
  textAlign: 'center',
})

const StyledLoadingBox = styled(LoadingBox)({
  height: '30px',
})

const ProgressIndicator = ({ message }) => (
  <StyledRoot>
    <StyledLoadingBox loading={true} />
    {message && <p>{message}</p>}
  </StyledRoot>
)

export default ProgressIndicator
