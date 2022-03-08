import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_4 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import Main from '@govuk-react/main'
import Breadcrumbs from '@govuk-react/breadcrumbs'
import { Link } from 'react-router-dom'

import LocalHeaderHeading from './LocalHeaderHeading'
import FlashMessages from './FlashMessages'

// Using <div> as there is already a <header> on the page
// role="region" gives the element significance as a landmark
const StyledHeader = styled('div')`
  padding-bottom: ${SPACING.SCALE_5};
  background-color: ${GREY_4};
  padding-top: ${SPACING.SCALE_3};
`

const StyledMain = styled(Main)`
  padding-top: 0;
`

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-bottom: ${SPACING.SCALE_5};
  margin-top: 0;
`

const StyledSuperheading = styled.div({
  fontSize: 20,
  lineHeight: '32px',
})

const StyledLink = styled('a')({
  fontSize: 20,
  display: 'inline-block',
  fontFamily: 'Arial, sans-serif',
  marginTop: 8,
  marginBottom: 8,
})

const LocalHeader = ({
  breadcrumbs,
  flashMessages,
  heading,
  headingLink,
  superheading,
  children,
  useReactRouter = false,
}) => (
  <StyledHeader
    aria-label="local header"
    data-auto-id="localHeader"
    data-test="localHeader"
    role="region"
  >
    <StyledMain>
      <BreadcrumbsWrapper>
        {breadcrumbs?.map((breadcrumb) =>
          breadcrumb.link ? (
            useReactRouter && breadcrumb.text !== 'Home' ? (
              <Breadcrumbs.Link
                as={Link}
                key={breadcrumb.link}
                to={breadcrumb.link}
              >
                {breadcrumb.text}
              </Breadcrumbs.Link>
            ) : (
              <Breadcrumbs.Link key={breadcrumb.link} href={breadcrumb.link}>
                {breadcrumb.text}
              </Breadcrumbs.Link>
            )
          ) : (
            breadcrumb.text
          )
        )}
      </BreadcrumbsWrapper>
      <FlashMessages flashMessages={flashMessages} />
      {superheading && <StyledSuperheading>{superheading}</StyledSuperheading>}
      {headingLink && (
        <StyledLink data-test="heading-link" href={headingLink.url}>
          {headingLink.text}
        </StyledLink>
      )}
      {heading && (
        <LocalHeaderHeading data-test="heading">{heading}</LocalHeaderHeading>
      )}
      {children}
    </StyledMain>
  </StyledHeader>
)

LocalHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ),
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }),
  heading: PropTypes.string,
  headingLink: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  superheading: PropTypes.node,
  children: PropTypes.node,
}

export default LocalHeader
