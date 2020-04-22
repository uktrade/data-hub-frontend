import PropTypes from 'prop-types'
import React from 'react'
import { H3 } from 'govuk-react'
import styled from 'styled-components'

import SpacedSectionBreak from './SpacedSectionBreak'

const StyledH3 = styled(H3)({
  flexGrow: 1,
})

const StyledHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const ContentWithHeading = ({ heading, children, headingActions }) => (
  <>
    <StyledHeader>
      <StyledH3>{heading}</StyledH3>
      {headingActions}
    </StyledHeader>
    <SpacedSectionBreak />
    {children}
  </>
)

ContentWithHeading.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
  headingComponent: PropTypes.func,
}

export default ContentWithHeading
