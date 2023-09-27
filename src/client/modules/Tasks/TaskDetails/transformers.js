import React from 'react'

import { Link } from 'govuk-react'
import urls from '../../../../lib/urls'

export const transformAdvisers = (advisers) => {
  return advisers.map((adviser) => adviser?.name)
}

export const transformCompanyToLink = (company) => {
  return company ? (
    <Link href={urls.companies.detail(company.id)}>{company.name}</Link>
  ) : (
    <></>
  )
}
