import React from 'react'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'

/**
 * When using a screen reader the aria-label attribute overrides
 * the link text entirely.
 *
 * When setting the aria-label ensure the text contains both
 * meaningful link text AND a warning.
 *
 *  For example:
 * <NewWindowLink
 *  href="tax-hike.html"
 *  aria-label="Read more about a HMRC tax hike (opens in new tab)"
 *  ...
 * >
 *  Read more...
 * </NewWindowLink>
 *
 * GDS recommends to use (opens in new tab) as part of the link and not to mention 'window'.
 * https://design-system.service.gov.uk/styles/typography/#links
 */

const NewWindowLink = ({ href, children, showWarning = true, ...rest }) => (
  <Link
    data-test="newWindowLink"
    href={href}
    rel="noreferrer noopener"
    target="_blank"
    {...rest}
  >
    {children}
    {showWarning && ' (opens in new tab)'}
  </Link>
)

NewWindowLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  showWarning: PropTypes.bool,
}

export default NewWindowLink
