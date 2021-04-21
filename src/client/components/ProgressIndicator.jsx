import React from 'react'
import LoadingBox from '@govuk-react/loading-box'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

const StyledRoot = styled.div({
  textAlign: 'center',
})

const StyledLoadingBox = styled(LoadingBox)({
  height: SPACING.SCALE_5,
  marginTop: SPACING.SCALE_5,
  marginBottom: SPACING.SCALE_3,
})

const ProgressIndicator = ({ message }) => (
  <StyledRoot>
    <StyledLoadingBox loading={true} />
    {message && <p>{message}</p>}
  </StyledRoot>
)

export default ProgressIndicator
