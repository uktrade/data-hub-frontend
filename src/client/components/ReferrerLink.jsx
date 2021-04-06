import React from 'react'
import { connect } from 'react-redux'
import Link from '@govuk-react/link'

/**
 * @function ReferrerLink
 * @description Same as {@govuk-react/link} but with {href} set to the referrer
 * URL that linked to this page. You can use this as a cancel button on forms
 * which act like modals.
 * @example
 * <ReferrerLink>Back</ReferrerLink>
 */
export default connect(({ referrerUrl }) => ({
  referrerUrl,
}))(({ referrerUrl, ...props }) => <Link {...props} href={referrerUrl} />)
