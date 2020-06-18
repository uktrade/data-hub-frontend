import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormActions } from 'data-hub-components'
import { connect } from 'react-redux'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import Task from '../../../client/components/Task'
import Form from '../../../client/components/Form'
import { PIPELINE__UNARCHIVE_PIPELINE_SUCCESS } from '../../../client/actions'

import {
  ID as STATE_ID,
  TASK_GET_PIPELINE_ITEM,
  TASK_UNARCHIVE_PIPELINE_ITEM,
  state2props,
} from './state'
import { PipelineItemPropType } from './constants'
import PipelineDetails from './PipelineDetails'
import GetPipelineData from './GetPipelineData'
import { getPipelineUrl } from './utils'

const StyledP = styled.p`
  margin: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_5} 0;
`

function UnarchivePipelineItemForm({
  pipelineItemId,
  currentPipelineItem,
  savedPipelineItem,
}) {
  let loading = false
  useEffect(() => {
    loading = false
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
        const unarchivePipelineItem = getTask(
          TASK_UNARCHIVE_PIPELINE_ITEM,
          STATE_ID
        )

        return (
          <GetPipelineData
            task={getTask(TASK_GET_PIPELINE_ITEM, STATE_ID)}
            pipelineItemId={pipelineItemId}
            currentPipelineItem={currentPipelineItem}
          >
            {() => (
              <LoadingBox loading={loading}>
                <StyledP>
                  Unarchiving this project will restore these project details in
                  your pipeline.
                </StyledP>
                <PipelineDetails item={currentPipelineItem}></PipelineDetails>
                <Form
                  id={STATE_ID}
                  onSubmit={() => {
                    loading = true
                    unarchivePipelineItem.start({
                      payload: {
                        pipelineName: currentPipelineItem.name,
                        pipelineItemId,
                      },
                      onSuccessDispatch: PIPELINE__UNARCHIVE_PIPELINE_SUCCESS,
                    })
                  }}
                  submissionError={unarchivePipelineItem.errorMessage}
                >
                  <FormActions>
                    <Button>Unarchive project</Button>
                    <Link href={getPipelineUrl(currentPipelineItem)}>
                      Cancel
                    </Link>
                  </FormActions>
                </Form>
              </LoadingBox>
            )}
          </GetPipelineData>
        )
      }}
    </Task>
  )
}

UnarchivePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default connect(state2props)(UnarchivePipelineItemForm)
