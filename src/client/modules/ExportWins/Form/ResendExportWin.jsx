import React from 'react'
import Button from '@govuk-react/button'
import styled from 'styled-components'

import { EXPORT_WIN_RESENT__SUCCESS } from '../../../actions'
import { GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import multiInstance from '../../../utils/multiinstance'
import { TASK_RESEND_EXPORT_WIN } from './state'
import Task from '../../../components/Task'

const StyledButton = styled(Button)({
  margin: 0,
})

const _ResendExportWin = ({ id }) => {
  return (
    <Task>
      {(getTask) => {
        const task = getTask(TASK_RESEND_EXPORT_WIN, id)
        return (
          <StyledButton
            type="button" // We don't want to submit the form
            buttonColour={GREY_3}
            buttonTextColour={TEXT_COLOUR}
            disabled={task.progress}
            data-test="resend-export-win"
            onClick={() => {
              task.start({
                payload: id,
                onSuccessDispatch: EXPORT_WIN_RESENT__SUCCESS,
              })
            }}
          >
            Resend export win
          </StyledButton>
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
