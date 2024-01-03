import PropTypes from 'prop-types'
import React from 'react'
import { Button, H3, Link } from 'govuk-react'
import styled from 'styled-components'

import SpacedSectionBreak from './SpacedSectionBreak'
import { BLUE } from '../utils/colours'
import urls from '../../lib/urls'

const StyledHeading = styled(H3)({
  flexGrow: 1,
})

const StyledHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const ContentWithHeading = ({ heading, children, headingActions }) => (
  <section>
    <StyledHeader>
      <StyledHeading size={24}>{heading}</StyledHeading>
      {headingActions}
      <Button
        buttonColour={BLUE}
        href={urls.tasks.create()}
        as={Link}
        data-test="add-task"
      >
        Add task
      </Button>
    </StyledHeader>
    <SpacedSectionBreak />
    {children}
  </section>
)

ContentWithHeading.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
  headingComponent: PropTypes.func,
}

export default ContentWithHeading
