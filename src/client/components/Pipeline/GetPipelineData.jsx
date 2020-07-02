import React from 'react'

import styled from 'styled-components'

import { spacing } from '@govuk-react/lib'

import Task from '../Task'
import { ID as STATE_ID, TASK_GET_PIPELINE_LIST } from './state'
import { PIPELINE__LIST_LOADED } from '../../actions'

import ProgressIndicator from '../ProgressIndicator'
import ErrorSummary from '@govuk-react/error-summary'

const StyledError = styled.div`
  ${spacing.responsive({
    size: 3,
    property: 'margin',
    direction: ['top'],
  })}
`

function PipelineStates({
  items,
  children,
  task,
  status,
  includeArchive,
  sortBy,
  showLoader,
}) {
  const { progress, error, errorMessage } = task

  React.useEffect(() => {
    if (!progress) {
      task.start({
        payload: {
          status,
          sortby: sortBy,
          ...(!includeArchive && { archived: false }),
        },
        onSuccessDispatch: PIPELINE__LIST_LOADED,
      })
    }
  }, [status, includeArchive, sortBy])

  if (error) {
    return (
      <StyledError>
        <ErrorSummary
          heading="There is a problem"
          description={`Error: ${errorMessage}`}
          errors={[]}
        />
      </StyledError>
    )
  }

  if (progress && !items && showLoader) {
    return <ProgressIndicator message="Loading projects..." />
  }

  return !!items && children({ items, progress })
}

const GetPipeLineData = ({
  status,
  lists,
  children,
  filter,
  showLoader = true,
}) => {
  const { includeArchive, sortBy } = filter
  return (
    <>
      <Task>
        {(getTask) => {
          return (
            <PipelineStates
              showLoader={showLoader}
              items={lists[status]}
              status={status}
              sortBy={sortBy}
              includeArchive={includeArchive}
              task={getTask(
                TASK_GET_PIPELINE_LIST,
                `${STATE_ID}_${status}_${
                  includeArchive ? 'filter' : ''
                }_${sortBy}`
              )}
            >
              {children}
            </PipelineStates>
          )
        }}
      </Task>
    </>
  )
}

export default GetPipeLineData
