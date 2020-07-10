import React, { useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormActions } from 'data-hub-components'
import { connect } from 'react-redux'
import { RED } from 'govuk-colours'
import WarningText from '@govuk-react/warning-text'
import LoadingBox from '@govuk-react/loading-box'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import Task from '../../../client/components/Task'
import Form from '../../../client/components/Form'
import { PIPELINE__DELETE_ITEM } from '../../../client/actions'

import { ID as STATE_ID, TASK_DELETE_PIPELINE_ITEM, state2props } from './state'
import { PipelineItemPropType } from './constants'
import PipelineDetails from './PipelineDetails'
import GetPipelineData from './GetPipelineData'
import { getPipelineUrl } from './utils'

const StyledWarningText = styled(WarningText)`
  margin-bottom: ${SPACING.SCALE_5};
`

function DeletePipelineItemForm({
  pipelineItemId,
  currentPipelineItem,
  itemDeleted,
}) {
  useEffect(() => {
    if (itemDeleted) {
      /**
       * TODO: Replace with react router navigation.
       * As we move to SPA clear the saveId from the state before navigation.
       */
      window.location.href = getPipelineUrl(currentPipelineItem)
    }
  }, [itemDeleted])

  return (
    <Task>
      {(getTask) => {
        const deletePipelineItem = getTask(TASK_DELETE_PIPELINE_ITEM, STATE_ID)

        return (
          <GetPipelineData
            getTask={getTask}
            pipelineItemId={pipelineItemId}
            currentPipelineItem={currentPipelineItem}
          >
            {() => (
              <LoadingBox loading={deletePipelineItem.progress}>
                <StyledWarningText>
                  Deleting this project will remove all project details from
                  your pipeline.
                </StyledWarningText>
                <PipelineDetails item={currentPipelineItem}></PipelineDetails>
                <Form
                  id={STATE_ID}
                  onSubmit={() => {
                    deletePipelineItem.start({
                      payload: {
                        projectName: currentPipelineItem.name,
                        pipelineItemId,
                      },
                      onSuccessDispatch: PIPELINE__DELETE_ITEM,
                    })
                  }}
                  submissionError={deletePipelineItem.errorMessage}
                >
                  <FormActions>
                    <Button buttonColour={RED}>Delete project</Button>
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

DeletePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
  itemDeleted: PropTypes.bool,
}

export default connect(state2props)(DeletePipelineItemForm)
