import React from 'react'
import Button from '@govuk-react/button'

import { EXPORT_WIN_RESENT__SUCCESS } from '../../../actions'
import multiInstance from '../../../utils/multiinstance'
import { TASK_RESEND_EXPORT_WIN } from './state'
import Task from '../../../components/Task'

const _ResendExportWin = ({ id }) => {
  return (
    <Task>
      {(getTask) => {
        const task = getTask(TASK_RESEND_EXPORT_WIN, id)
        return (
          <Button
            disabled={task.progress}
            onClick={() => {
              task.start({
                payload: id,
                onSuccessDispatch: EXPORT_WIN_RESENT__SUCCESS,
              })
            }}
          >
            Resend export win
          </Button>
        )
      }}
    </Task>
  )
}

export const ResendExportWin = multiInstance({
  name: 'ResendExportWin',
  actionPattern: 'EXPORT_WIN_RESENT__',
  reducer: (state, action) => {
    switch (action.type) {
      case EXPORT_WIN_RESENT__SUCCESS:
        return {
          success: true,
        }
      default:
        return state
    }
  },
  component: _ResendExportWin,
})
