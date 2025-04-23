import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import Main from '@govuk-react/main'
import Breadcrumbs from '@govuk-react/breadcrumbs'

import { GREY_4 } from '../../../client/utils/colours'
import LocalHeaderHeading from '../LocalHeader/LocalHeaderHeading'
import FlashMessages from '../LocalHeader/FlashMessages'
import { InvestmentResource } from '../Resource'
import urls from '../../../lib/urls'
import InvestmentProjectLocalHeader from '../InvestmentProjectLocalHeader'
import AccessibleLink from '../Link'

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

const StyledLink = styled(AccessibleLink)({
  fontSize: 20,
  display: 'inline-block',
  fontFamily: 'Arial, sans-serif',
  marginTop: 8,
  marginBottom: 8,
})

/**
 * The generic local header component.
 */
const InvestmentLocalHeader = ({ breadcrumbs, flashMessages, projectId }) => {
  return (
    <StyledHeader
      aria-label="local header"
      data-auto-id="localHeader"
      data-test="localHeader"
      role="region"
    >
      <StyledMain>
        <BreadcrumbsWrapper data-test="breadcrumbs">
          {breadcrumbs?.map((breadcrumb) =>
            breadcrumb.link ? (
              <Breadcrumbs.Link key={breadcrumb.link} href={breadcrumb.link}>
                {breadcrumb.text}
              </Breadcrumbs.Link>
            ) : (
              <Fragment key={breadcrumb.text}>{breadcrumb.text}</Fragment>
            )
          )}
        </BreadcrumbsWrapper>
        <FlashMessages flashMessages={flashMessages} />
        <InvestmentResource id={projectId}>
          {(project) => (
            <>
              <StyledLink
                data-test="heading-link"
                href={urls.companies.detail(project.investorCompany.id)}
              >
                {project.investorCompany.name}
              </StyledLink>
              <LocalHeaderHeading data-test="heading">
                {project.name}
              </LocalHeaderHeading>
              <InvestmentProjectLocalHeader investment={project} />
            </>
          )}
        </InvestmentResource>
      </StyledMain>
    </StyledHeader>
  )
}

InvestmentLocalHeader.propTypes = {
  /**
   * Contains the breadcrumbs
   */
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    })
  ),
  /**
   * Contains the flash messages
   */
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
  /**
   * Contains the heading text to be displayed
   */
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /**
   * Contains the subheading text to be displayed
   */
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Contains a link that appears above the heading
   */
  headingLink: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  /**
   * Contains an item that renders above the heading (in the same position as the headingLink)
   */
  superheading: PropTypes.node,
  /**
   * Contains an item that renders below the heading
   */
  children: PropTypes.node,
}

export default InvestmentLocalHeader
