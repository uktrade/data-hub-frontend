import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout } from '../../../components'
import { state2props } from './state'
import ExportFormFields from './ExportFormFields'
import {
  TASK_GET_EXPORT_DETAIL,
  ID as EXPORT_DETAILS_ID,
} from '../ExportDetails/state'
import { EXPORT_LOADED } from '../../../actions'
import withRouter from './withRouter'

const DISPLAY_EDIT_EXPORT = 'Edit export'

const getBreadcrumbs = (exportItem) => {
  const defaultBreadcrumbs = [
    {
      link: urls.exportPipeline.index(),
      text: 'Home',
    },
  ]

  if (exportItem) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.exportPipeline.details(exportItem.id),
        text: exportItem.title,
      },
      { text: 'Edit export' },
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
        cancelRedirectUrl={urls.exportPipeline.details(exportId)}
        redirectToUrl={urls.exportPipeline.details(exportId)}
        flashMessage={({ data }) => `Changes saved to '${data.title}'`}
      />
    </DefaultLayout>
  )
}

export default withRouter(connect(state2props)(ExportFormEdit))
