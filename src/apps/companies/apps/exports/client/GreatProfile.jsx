import React from 'react'
import urls from '../../../../../lib/urls'
import { Link } from 'govuk-react'

export default ({ profile, companyNumber }) =>
  profile.value === 'published' ? (
    <Link
      href={urls.external.greatProfile(companyNumber)}
      target="_blank"
      aria-label="opens in a new tab"
    >
      "Find a supplier" profile
    </Link>
  ) : profile.value === 'unpublished' ? (
    'Profile not published'
  ) : (
    'No profile'
  )
