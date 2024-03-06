import React from 'react'
import { Navigate } from 'react-router-dom-v5-compat'

import urls from '../../../../lib/urls'

// Redirect from /exportwins to /exportwins/pending
const ExportsWinsRedirect = () => (
  <Navigate to={urls.companies.exportWins.pending()} />
)

export default ExportsWinsRedirect
