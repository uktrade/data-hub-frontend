import React from 'react'
import { useLocation } from 'react-router-dom'

import { TASK_GET_EXPORT_WIN, TASK_GET_EXPORT_PROJECT } from './state'
import { getQueryParamsFromLocation } from '../../../utils/url'
import ExportWinForm from './ExportWinForm'

// If we're converting an export project to an export win
// then we'll have the export id, otherwise we're creating
// the export win from scratch.
export const CreateExportWin = () => {
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  return (
    <ExportWinForm
      title="Add export win"
      companyId={queryParams.company}
      initialValuesTaskName={
        queryParams.export ? TASK_GET_EXPORT_PROJECT : null
      }
      initialValuesPayload={{
        id: queryParams.export ? queryParams.export : null,
      }}
    />
  )
}

// Here we're editing an existing win so we'll have the
// export win id.
export const EditExportWin = ({ location, match }) => {
  const queryParams = getQueryParamsFromLocation(location)
  return (
    <ExportWinForm
      title="Edit export win"
      companyId={queryParams.company}
      exportWinId={match.params.winId}
      initialValuesTaskName={TASK_GET_EXPORT_WIN}
      initialValuesPayload={{
        id: match.params.winId,
      }}
    />
  )
}
