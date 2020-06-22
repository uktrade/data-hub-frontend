import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { FieldTextarea, FormActions } from 'data-hub-components'
import { connect } from 'react-redux'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING, FONT_SIZE, MEDIA_QUERIES } from '@govuk-react/constants'

import { H2 } from '@govuk-react/heading'

import Task from '../../../client/components/Task'
import Form from '../../../client/components/Form'
import { PIPELINE__ARCHIVE_ITEM } from '../../../client/actions'

import {
  ID as STATE_ID,
  TASK_GET_PIPELINE_ITEM,
  TASK_ARCHIVE_PIPELINE_ITEM,
  state2props,
} from './state'
import { PipelineItemPropType } from './constants'
import PipelineDetails from './PipelineDetails'
import GetPipelineData from './GetPipelineData'
import { getPipelineUrl } from './utils'

const StyledH2 = styled(H2)`
  margin-top: ${SPACING.SCALE_6};
  margin-bottom: ${SPACING.SCALE_3};
  font-size: ${FONT_SIZE.SIZE_16};

  ${MEDIA_QUERIES.DESKTOP} {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

const StyledP = styled.p`
  margin: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_5} 0;
`

function ArchivePipelineItemForm({
  pipelineItemId,
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
        const archivePipelineItem = getTask(
          TASK_ARCHIVE_PIPELINE_ITEM,
          STATE_ID
        )

        return (
          <GetPipelineData
            task={getTask(TASK_GET_PIPELINE_ITEM, STATE_ID)}
            pipelineItemId={pipelineItemId}
            currentPipelineItem={currentPipelineItem}
          >
            {() => (
              <LoadingBox loading={archivePipelineItem.progress}>
                <StyledP>
                  Archive this project if it’s no longer required or active.
                  <br />
                  You can unarchive or delete an archived project from your
                  pipeline dashboard.
                </StyledP>
                <PipelineDetails item={currentPipelineItem}></PipelineDetails>
                <Form
                  id={STATE_ID}
                  onSubmit={(values) => {
                    archivePipelineItem.start({
                      payload: { values, pipelineItemId },
                      onSuccessDispatch: PIPELINE__ARCHIVE_ITEM,
                    })
                  }}
                  submissionError={archivePipelineItem.errorMessage}
                >
                  <StyledH2>Reason for archive</StyledH2>
                  <FieldTextarea
                    label="Details on why the project is being archived"
                    name="reason"
                    type="text"
                    required="Enter why the project is being archived"
                    className="govuk-!-width-two-thirds"
                  />
                  <FormActions>
                    <Button>Archive project</Button>
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

ArchivePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default connect(state2props)(ArchivePipelineItemForm)
