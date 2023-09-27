import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import Task from '../../../components/Task'
import { FORM_LAYOUT } from '../../../../common/constants'
import urls from '../../../../lib/urls'
import { DefaultLayout, Form, FormLayout } from '../../../components'
import { TASK_DELETE_EXPORT, state2props } from './state'
import {
  ID as EXPORT_DETAILS_ID,
  TASK_GET_EXPORT_DETAIL,
} from '../ExportDetails/state'
import { EXPORT_LOADED } from '../../../actions'
import { RED } from '../../../../client/utils/colours'

const DISPLAY_DELETE_EXPORT = 'Delete export'

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
      { text: 'Are you sure you want to delete...' },
    ]
  }

  return defaultBreadcrumbs
}

const ExportFormDelete = ({ exportItem }) => {
  const { exportId } = useParams()
  return (
    <DefaultLayout
      heading=""
      subheading={
        exportItem &&
        `Are you sure you want to delete the export ${exportItem?.company?.name} — ‘${exportItem?.title}’?`
      }
      pageTitle={DISPLAY_DELETE_EXPORT}
      breadcrumbs={getBreadcrumbs(exportItem)}
    >
      <Task.Status
        name={TASK_GET_EXPORT_DETAIL}
        id={EXPORT_DETAILS_ID}
        progressMessage="Loading export details"
        startOnRender={{
          payload: exportId,
          onSuccessDispatch: EXPORT_LOADED,
        }}
      >
        {() => (
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="export-delete-form"
              analyticsFormName="deleteExportForm"
              cancelRedirectTo={() => urls.exportPipeline.details(exportId)}
              redirectTo={() => urls.exportPipeline.index()}
              submissionTaskName={TASK_DELETE_EXPORT}
              initialValues={exportItem}
              transformPayload={(values) => ({ exportId: values.id, values })}
              submitButtonLabel={'Yes, delete this export'}
              submitButtonColour={RED}
              flashMessage={() => `‘${exportItem?.title}’ has been deleted`}
            />
          </FormLayout>
        )}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(ExportFormDelete)
