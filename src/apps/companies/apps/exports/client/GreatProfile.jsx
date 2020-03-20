import React from 'react'
import urls from '../../../../../lib/urls'
import { NewWindowLink } from 'data-hub-components'

export default ({ profile, companyNumber }) =>
  profile.value === 'published' ? (
    <NewWindowLink href={urls.external.greatProfile(companyNumber)}>
      "Find a supplier" profile
    </NewWindowLink>
  ) : profile.value === 'unpublished' ? (
    'Profile not published'
  ) : (
    'No profile'
  )
