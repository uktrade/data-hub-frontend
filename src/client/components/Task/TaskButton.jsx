import React from 'react'
import Button from '@govuk-react/button'

import ProgressIndicator from '../ProgressIndicator'
import Task from '.'

/**
 * The TaskButton component starts a Task and renders a progress indicator whilst loading.
 * @param {Object} props
 * @param {string} props.id - The _task_ id
 * @param {string} props.name - The _task_ name
 * @param {object} [props.startOptions=] - The _task_ start options
 * @param {string} [props.children=] - the _button_ text
 * @example usage within a list item
    <TaskButton
      id={item.id}
      name={TASK_RESEND_EXPORT_WIN}
      startOptions={{ payload: item.id }}
    >
      Resend export win
    </TaskButton>
 */
export const TaskButton = ({ id, name, startOptions, children }) => (
  <Task>
    {(getTask) => {
      const task = getTask(name, id)
      return (
        <Task.Status
          id={id}
          name={name}
          renderProgress={ProgressIndicator.Inline}
        >
          {() => (
            <Button
              disabled={task.progress}
              onClick={() => task.start(startOptions)}
            >
              {children}
            </Button>
          )}
        </Task.Status>
      )
    }}
  </Task>
)
