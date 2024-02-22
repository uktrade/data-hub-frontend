import React from 'react'
import { Redirect } from 'react-router-dom'

import urls from '../../../lib/urls'

// Redirect from /exportwins to /exportwins/sent
const ExportsWinsRedirect = () => (
  <Redirect to={urls.companies.exportWins.sent()} />
)

export default ExportsWinsRedirect
