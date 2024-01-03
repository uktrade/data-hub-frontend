import React from 'react'
import { Redirect } from 'react-router-dom'

import urls from '../../../lib/urls'

// Redirect from /exportwins to /exportwins/unconfirmed
const ExportsWinsRedirect = () => (
  <Redirect to={urls.companies.exportWins.unconfirmed()} />
)

export default ExportsWinsRedirect
