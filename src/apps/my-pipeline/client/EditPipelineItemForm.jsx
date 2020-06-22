import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorSummary from '@govuk-react/error-summary'

import Task from '../../../client/components/Task'
import LoadingBox from '@govuk-react/loading-box'

import {
  PIPELINE__EDIT_ITEM,
  PIPELINE__GET_ITEM,
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
import moment from 'moment'

function formatInitialValues(values) {
  const { sector, contact } = values
  const expectedWinDate = moment(values.expected_win_date, 'YYYY-MM-DD', true)
  return {
    name: values.name,
    category: values.status,
    likelihood: String(values.likelihood_to_win),
    sector: sector ? { value: sector.id, label: sector.segment } : null,
    contact: contact ? { value: contact.id, label: contact.name } : null,
    export_value: values.potential_value,
    expected_win_date: expectedWinDate.isValid()
      ? {
          month: expectedWinDate.format('MM'),
          year: expectedWinDate.format('YYYY'),
        }
      : {
          month: '',
          year: '',
        },
  }
}

function PipelineCheck({
  pipelineItemId,
  getPipelineData,
  children,
  currentPipelineItem,
}) {
  useEffect(() => {
    getPipelineData.start({
      payload: { pipelineItemId },
      onSuccessDispatch: PIPELINE__GET_ITEM,
    })
  }, [pipelineItemId])

  if (getPipelineData.error) {
    return (
      <ErrorSummary
        heading="There is a problem"
        description={`Error: ${getPipelineData.errorMessage}`}
        errors={[]}
      />
    )
  }
  if (!currentPipelineItem) {
    return <ProgressIndicator message="getting pipeline..." />
  }
  return <>{children}</>
}

function EditPipelineItemForm({
  pipelineItemId,
  contacts,
  sectors,
  currentPipelineItem,
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
        const getPipelineData = getTask(TASK_GET_PIPELINE_ITEM, STATE_ID)
        const editPipelineItem = getTask(TASK_EDIT_PIPELINE_ITEM, STATE_ID)
        return (
          <>
            <LoadingBox>
              <PipelineCheck
                currentPipelineItem={currentPipelineItem}
                pipelineItemId={pipelineItemId}
                getPipelineData={getPipelineData}
              >
                <PipelineForm
                  submissionError={editPipelineItem.errorMessage}
                  onSubmit={(values) => {
                    editPipelineItem.start({
                      payload: { values, pipelineItemId, currentPipelineItem },
                      onSuccessDispatch: PIPELINE__EDIT_ITEM,
                    })
                  }}
                  cancelLink={getPipelineUrl(currentPipelineItem)}
                  initialValue={
                    currentPipelineItem &&
                    formatInitialValues(currentPipelineItem)
                  }
                  sectors={sectors}
                  contacts={contacts}
                />
              </PipelineCheck>
            </LoadingBox>
          </>
        )
      }}
    </Task>
  )
}

EditPipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default EditPipelineItemForm
