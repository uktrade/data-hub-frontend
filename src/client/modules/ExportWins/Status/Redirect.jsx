import React from 'react'
import { Navigate } from 'react-router-dom-v5-compat'

import urls from '../../../../lib/urls'

// Redirect from /exportwins to /exportwins/rejected
const ExportsWinsRedirect = () => (
  <Navigate to={urls.companies.exportWins.rejected()} />
)

export default ExportsWinsRedirect
