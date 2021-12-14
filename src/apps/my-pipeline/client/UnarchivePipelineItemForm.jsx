import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import Task from '../../../client/components/Task'

import { Main, FormActions } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

import {
  ID as STATE_ID,
  TASK_UNARCHIVE_PIPELINE_ITEM,
  state2props,
} from './state'
import { PipelineItemPropType } from './constants'
import PipelineDetails from './PipelineDetails'
import GetPipelineData from './GetPipelineData'
import { getPipelineUrl } from './utils'

import TaskForm from '../../../client/components/Task/Form'

const StyledP = styled.p`
  margin: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_5} 0;
`

function UnarchivePipelineItemForm({
  pipelineItemId,
  currentPipelineItem,
  savedPipelineItem,
}) {
  return (
    <>
      <LocalHeader
        heading="Unarchive project"
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.pipeline.index(), text: 'My Pipeline' },
          { link: null, text: 'Unarchive project' },
        ]}
      />
      <Main>
        <Task>
          {(getTask) => {
            const unarchivePipelineItem = getTask(
              TASK_UNARCHIVE_PIPELINE_ITEM,
              STATE_ID
            )

            return (
              <GetPipelineData
                getTask={getTask}
                pipelineItemId={pipelineItemId}
                currentPipelineItem={currentPipelineItem}
              >
                {() => (
                  <LoadingBox loading={unarchivePipelineItem.progress}>
                    <StyledP>
                      Unarchiving this project will restore these project
                      details in your pipeline.
                    </StyledP>
                    <PipelineDetails
                      item={currentPipelineItem}
                    ></PipelineDetails>
                    <TaskForm
                      id={STATE_ID}
                      submissionTaskName={TASK_UNARCHIVE_PIPELINE_ITEM}
                      analyticsFormName="unarchive-pipeline-item-form"
                      flashMessage={() => unarchivePipelineItem.errorMessage}
                      redirectTo={() => getPipelineUrl(savedPipelineItem)}
                    >
                      <FormActions>
                        <Button>Unarchive project</Button>
                        <Link href={getPipelineUrl(currentPipelineItem)}>
                          Cancel
                        </Link>
                      </FormActions>
                    </TaskForm>
                  </LoadingBox>
                )}
              </GetPipelineData>
            )
          }}
        </Task>
      </Main>
    </>
  )
}

UnarchivePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default connect(state2props)(UnarchivePipelineItemForm)
