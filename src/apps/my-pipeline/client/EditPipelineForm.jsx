import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorSummary from '@govuk-react/error-summary'

import Task from '../../../client/components/Task'
import LoadingBox from '@govuk-react/loading-box'

import {
  PIPELINE__EDIT_PIPELINE_SUCCESS,
  PIPELINE__GET_PIPELINE_SUCCESS,
} from '../../../client/actions'
import {
  ID as STATE_ID,
  TASK_GET_PIPELINE_ITEM,
  TASK_EDIT_PIPELINE_ITEM,
} from './state'
import ProgressIndicator from '../../../client/components/ProgressIndicator'
import PipelineForm from './PipelineForm'
import { PipelineItemPropType } from './constants'
import { getPipelineUrl } from './utils'

function formatInitialValues({ name, status }) {
  return {
    name,
    category: status,
  }
}

function PipelineCheck({
  pipelineItemId,
  getCompanyByPipeline,
  children,
  currentPipeline,
}) {
  useEffect(() => {
    getCompanyByPipeline.start({
      payload: { pipelineItemId },
      onSuccessDispatch: PIPELINE__GET_PIPELINE_SUCCESS,
    })
  }, [pipelineItemId])

  if (getCompanyByPipeline.error) {
    return (
      <ErrorSummary
        heading="There is a problem"
        description={`Error: ${getCompanyByPipeline.errorMessage}`}
        errors={[]}
      />
    )
  }
  if (!currentPipeline) {
    return <ProgressIndicator message="getting pipeline..." />
  }
  return <>{children}</>
}

function EditPipelineForm({
  pipelineItemId,
  currentPipeline,
  savedPipelineItem,
}) {
  useEffect(() => {
    if (savedPipelineItem) {
      /**
       * TODO: Replace with react router navigation.
       * As we move to SPA clear the saveId from the state before navigation.
       */
      window.location.href = getPipelineUrl(savedPipelineItem)
    }
  }, [savedPipelineItem])

  return (
    <Task>
      {(getTask) => {
        const getCompanyByPipeline = getTask(TASK_GET_PIPELINE_ITEM, STATE_ID)
        const editPipelineItem = getTask(TASK_EDIT_PIPELINE_ITEM, STATE_ID)
        return (
          <>
            <LoadingBox>
              <PipelineCheck
                currentPipeline={currentPipeline}
                pipelineItemId={pipelineItemId}
                getCompanyByPipeline={getCompanyByPipeline}
              >
                <PipelineForm
                  submissionError={editPipelineItem.errorMessage}
                  onSubmit={(values) => {
                    editPipelineItem.start({
                      payload: { values, pipelineItemId },
                      onSuccessDispatch: PIPELINE__EDIT_PIPELINE_SUCCESS,
                    })
                  }}
                  cancelLink={getPipelineUrl(currentPipeline)}
                  initialValue={
                    currentPipeline && formatInitialValues(currentPipeline)
                  }
                />
              </PipelineCheck>
            </LoadingBox>
          </>
        )
      }}
    </Task>
  )
}

EditPipelineForm.propTypes = {
  pipelineItemId: PropTypes.string,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default EditPipelineForm
