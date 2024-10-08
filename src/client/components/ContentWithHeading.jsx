import PropTypes from 'prop-types'
import React from 'react'
import { H2, H3 } from 'govuk-react'
import styled from 'styled-components'

import SpacedSectionBreak from './SpacedSectionBreak'

const StyledH2Heading = styled(H2)({
  flexGrow: 1,
})

const StyledH3Heading = styled(H3)({
  flexGrow: 1,
})

const StyledHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const ContentWithHeading = ({
  heading,
  children,
  headingActions,
  level = 3,
}) => {
  let StyledHeading

  if (level == '2') {
    StyledHeading = <StyledH2Heading size={24}>{heading}</StyledH2Heading>
  } else {
    StyledHeading = <StyledH3Heading size={24}>{heading}</StyledH3Heading>
  }

  return (
    <section>
      <StyledHeader>
        {StyledHeading}
        {headingActions}
      </StyledHeader>
      <SpacedSectionBreak />
      {children}
    </section>
  )
}

ContentWithHeading.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
  headingComponent: PropTypes.func,
}

export default ContentWithHeading
