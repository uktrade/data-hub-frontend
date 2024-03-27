import React from 'react'
import { useParams } from 'react-router-dom'

import { TASK_GET_EXPORT_WIN, TASK_GET_EXPORT_PROJECT } from './state'
import ExportWinForm from './ExportWinForm'

// If we're converting an export project to an export win
// then we'll have the export id, otherwise we're creating
// the export win from scratch.
export const CreateExportWin = () => {
  const params = useParams()
  const exportId = params.exportId
  return (
    <ExportWinForm
      title="Add export win"
      exportId={exportId}
      companyId={params.companyId}
      initialValuesTaskName={exportId ? TASK_GET_EXPORT_PROJECT : null}
      initialValuesPayload={{ id: exportId }}
    />
  )
}

// Here we're editing an existing win so we'll have the
// export win id.
export const EditExportWin = ({ match }) => {
  return (
    <ExportWinForm
      title="Edit export win"
      companyId={match.params.companyId}
      exportWinId={match.params.winId}
      initialValuesTaskName={TASK_GET_EXPORT_WIN}
      initialValuesPayload={{
        id: match.params.winId,
      }}
    />
  )
}
