import React from 'react'
import { useParams, useLocation } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout } from '../../../components'

const DISPLAY_EDIT_EXPORT = 'Edit export'
const DISPLAY_ADD_EXPORT = 'Add export'

function useQuery() {
  // A custom hook that builds on useLocation to parse
  // the query string for you.

  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const ExportForm = () => {
  let query = useQuery()

  const { id } = useParams()
  const companyId = query.get('companyId')

  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    {
      link: urls.companies.detail(companyId),
      text: 'Company name',
    },
  ]

  return (
    <DefaultLayout
      heading={id ? DISPLAY_EDIT_EXPORT : DISPLAY_ADD_EXPORT}
      pageTitle={id ? DISPLAY_EDIT_EXPORT : DISPLAY_ADD_EXPORT}
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    ></DefaultLayout>
  )
}

export default ExportForm
