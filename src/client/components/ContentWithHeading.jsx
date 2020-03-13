import PropTypes from 'prop-types'
import React from 'react'
import { H3 } from 'govuk-react'

import SpacedSectionBreak from './SpacedSectionBreak'

const ContentWithHeading = ({
  heading,
  children,
  headingComponent: Heading = H3,
}) => (
  <>
    <Heading>{heading}</Heading>
    <SpacedSectionBreak />
    {children}
  </>
)

ContentWithHeading.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  headingComponent: PropTypes.func,
}

export default ContentWithHeading
