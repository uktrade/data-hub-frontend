import React from 'react'
import { Navigate } from 'react-router-dom'

import urls from '../../../lib/urls'

const InvestmentsRedirect = () => (
  <Navigate to={urls.investments.projects.index()} />
)

export default InvestmentsRedirect
