import React from 'react'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'

const NewWindowLink = ({ href, showHelpText, children, ...rest }) => (
  <>
    <Link
      href={href}
      target="_blank"
      aria-label="Opens in a new window or tab"
      {...rest}
    >
      {children}
    </Link>{' '}
    {showHelpText && '(opens in a new window or tab)'}
  </>
)

NewWindowLink.propTypes = {
  href: PropTypes.string.isRequired,
  showHelpText: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

NewWindowLink.defaultProps = {
  showHelpText: true,
}

export default NewWindowLink
