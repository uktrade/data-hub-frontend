import React from 'react'
import LoadingBox from '@govuk-react/loading-box'
import styled from 'styled-components'

const StyledLoadingBox = styled(LoadingBox)({
  height: '30px',
})

const ProgressIndicator = () => <StyledLoadingBox loading={true} />

export default ProgressIndicator
