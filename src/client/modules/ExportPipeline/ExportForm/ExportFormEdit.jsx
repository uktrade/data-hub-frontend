import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout } from '../../../components'
import { state2props } from './state'
import ExportFormFields from './ExportFormFields'
import { TASK_GET_EXPORT_DETAIL } from '../ExportDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../ExportPipeline/ExportDetails/state'
import { EXPORT_LOADED } from '../../../actions'

const DISPLAY_EDIT_EXPORT = 'Edit export'

const getBreadcrumbs = (exportItem) => {
  const defaultBreadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
  ]

  if (exportItem) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.companies.activity.index(exportItem.company.id),
        text: exportItem.company.name,
      },
      { text: exportItem.title },
    ]
  }

  return defaultBreadcrumbs
}

const ExportFormEdit = ({ exportItem }) => {
  const { exportId } = useParams()
  return (
    <DefaultLayout
      heading={DISPLAY_EDIT_EXPORT}
      subheading={exportItem?.company?.name}
      pageTitle={DISPLAY_EDIT_EXPORT}
      breadcrumbs={getBreadcrumbs(exportItem)}
      useReactRouter={false}
    >
      <ExportFormFields
        analyticsFormName="editExportForm"
        taskProps={{
          name: TASK_GET_EXPORT_DETAIL,
          id: EXPORT_DETAILS_ID,
          progressMessage: 'Loading export details',
          startOnRender: {
            payload: exportId,
            onSuccessDispatch: EXPORT_LOADED,
          },
        }}
        exportItem={exportItem}
      />
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportFormEdit)
