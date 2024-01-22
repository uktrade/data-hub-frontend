import React from 'react'

import urls from '../../../../lib/urls'
import { NewWindowLink } from '../../../components'

export default ({ profileStatus, companyNumber }) =>
  profileStatus === 'published' ? (
    <NewWindowLink href={urls.external.greatProfile(companyNumber)}>
      "Find a supplier" profile
    </NewWindowLink>
  ) : profileStatus === 'unpublished' ? (
    'Profile not published'
  ) : (
    'No profile'
  )
