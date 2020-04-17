import React from 'react'
import Breadcrumbs from '@govuk-react/breadcrumbs'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import { GREY_4 } from 'govuk-colours'

const StyledBreadcrumbs = styled(Breadcrumbs)`
   {
    margin-bottom: ${SPACING.SCALE_5};
    margin-top: 0;
  }
`
const StyledH1 = styled('h1')`
   {
    ${typography.font({ size: 36, weight: 'bold' })};
  }
`

const StyledHeader = styled('header')`
   {
    padding-bottom: ${SPACING.SCALE_5};
    background-color: ${GREY_4};
    padding-top: ${SPACING.SCALE_3};
  }
`

const LocalHeader = ({ breadcrumbs, heading }) => {
  const breadcrumbItems = breadcrumbs.map((breadcrumb) =>
    breadcrumb.link ? (
      <Breadcrumbs.Link key={breadcrumb.link} href={breadcrumb.link}>
        {breadcrumb.text}
      </Breadcrumbs.Link>
    ) : (
      breadcrumb.text
    )
  )
  return (
    <StyledHeader aria-label="local header" data-auto-id="localHeader">
      <div className=" govuk-width-container">
        <StyledBreadcrumbs>{breadcrumbItems}</StyledBreadcrumbs>
        <StyledH1>{heading}</StyledH1>
      </div>
    </StyledHeader>
  )
}

LocalHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string.isRequired,
    }).isRequired
  ),
  heading: PropTypes.string.isRequired,
}

export default LocalHeader
