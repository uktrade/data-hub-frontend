import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorSummary from '@govuk-react/error-summary'

import ProgressIndicator from '../../../client/components/ProgressIndicator'
import { PIPELINE__GET_ITEM } from '../../../client/actions'
import { PipelineItemPropType } from './constants'

export default function GetPipelineData({
  task,
  pipelineItemId,
  currentPipelineItem,
  children,
}) {
  useEffect(() => {
    task.start({
      payload: { pipelineItemId },
      onSuccessDispatch: PIPELINE__GET_ITEM,
    })
  }, [pipelineItemId])

  if (task.error) {
    return (
      <ErrorSummary
        heading="There is a problem"
        description={`Error: ${task.errorMessage}`}
        errors={[]}
      />
    )
  }

  if (!currentPipelineItem) {
    return <ProgressIndicator message="Getting pipeline project details..." />
  }

  return children()
}

GetPipelineData.propTypes = {
  task: PropTypes.object.isRequired,
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
}
