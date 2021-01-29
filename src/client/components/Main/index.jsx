import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

const OuterContainer = styled('main')({
  paddingTop: SPACING.SCALE_5,
  textAlign: 'center',
})

export const InnerContainer = styled('div')({
  maxWidth: '1200px',
  marginLeft: SPACING.SCALE_3,
  marginRight: SPACING.SCALE_3,
  textAlign: 'left',
  [MEDIA_QUERIES.LARGESCREEN]: {
    marginLeft: SPACING.SCALE_5,
    marginRight: SPACING.SCALE_5,
  },
  // no 1020px breakpoint in constants yet
  '@media only screen and (min-width:1020px)': {
    margin: '0 auto',
  },
})

const Main = ({ children, ...props }) => (
  <OuterContainer
    {...props}
    role="main"
    id="main-content"
    data-auto-id="bodyMainContent"
  >
    <InnerContainer>{children}</InnerContainer>
  </OuterContainer>
)

Main.propTypes = {
  children: PropTypes.node,
}

Main.defaultProps = {
  children: undefined,
}

export default Main
