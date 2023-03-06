import React from 'react'
import { connect } from 'react-redux'

import urls from '../../../../lib/urls'
import { DefaultLayout } from '../../../components'
import { state2props } from './state'
import ExportFormFields from './ExportFormFields'

const DISPLAY_EDIT_EXPORT = 'Edit export'

const getBreadcrumbs = () => {
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
  ]

  return breadcrumbs
}

const ExportFormEdit = () => {
  return (
    <DefaultLayout
      heading={DISPLAY_EDIT_EXPORT}
      pageTitle={DISPLAY_EDIT_EXPORT}
      breadcrumbs={getBreadcrumbs()}
      useReactRouter={true}
    >
      <ExportFormFields />
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportFormEdit)
