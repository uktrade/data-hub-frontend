import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorSummary from '@govuk-react/error-summary'

import ProgressIndicator from '../../../client/components/ProgressIndicator'
import { PIPELINE__GET_ITEM } from '../../../client/actions'
import { PipelineItemPropType } from './constants'
import { ID as STATE_ID, TASK_GET_PIPELINE_ITEM } from './state'

export default function GetPipelineData({
  getTask,
  pipelineItemId,
  currentPipelineItem,
  children,
}) {
  const getPipelineItem = getTask(TASK_GET_PIPELINE_ITEM, STATE_ID)
  useEffect(() => {
    getPipelineItem.start({
      payload: { pipelineItemId },
      onSuccessDispatch: PIPELINE__GET_ITEM,
    })
  }, [pipelineItemId])

  if (getPipelineItem.error) {
    return (
      <ErrorSummary
        heading="There is a problem"
        description={`Error: ${getPipelineItem.errorMessage}`}
        errors={[]}
      />
    )
  }

  if (!currentPipelineItem) {
    return <ProgressIndicator message="Getting project details..." />
  }

  return children()
}

GetPipelineData.propTypes = {
  getTask: PropTypes.func.isRequired,
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
}
