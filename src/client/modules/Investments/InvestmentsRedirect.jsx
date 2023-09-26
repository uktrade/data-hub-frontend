import React from 'react'
import { Redirect } from 'react-router-dom'

import urls from '../../../lib/urls'

const InvestmentsRedirect = () => (
  <Redirect to={urls.investments.projects.index()} />
)

export default InvestmentsRedirect
