import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING, SITE_WIDTH } from '@govuk-react/constants'

import Hcsat from '../Hcsat'

const OuterContainer = styled('main')({
  paddingTop: SPACING.SCALE_5,
  textAlign: 'center',
})

export const InnerContainer = styled('div')({
  maxWidth: SITE_WIDTH,
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

/**
 * The`<Main>`is a layout component which wraps content inside the`<main>`HTML tag, this component also contains a grid container which will center the content in the page with the appropriate gutters and responsive behaviour we expect from [our grid](https://design-system.service.gov.uk/styles/layout/).
 *
 * It's important that we include this in all pages as the`<main>`represents the dominant content of the`<body>`of the document, this also acts as a landmark which can help assistive technologies.
 */
const Main = ({ children, ...props }) => (
  <OuterContainer
    {...props}
    role="main"
    id="main-content"
    data-test="bodyMainContent"
  >
    <InnerContainer>{children}</InnerContainer>
    <Hcsat />
  </OuterContainer>
)

Main.propTypes = {
  /**
   * Text for main
   */
  children: PropTypes.node,
}

export default Main
