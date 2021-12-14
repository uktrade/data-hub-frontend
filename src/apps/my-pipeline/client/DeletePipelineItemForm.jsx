import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RED } from 'govuk-colours'
import WarningText from '@govuk-react/warning-text'
import LoadingBox from '@govuk-react/loading-box'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import Task from '../../../client/components/Task'

import { Main, FormActions } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

import { ID as STATE_ID, TASK_DELETE_PIPELINE_ITEM, state2props } from './state'
import { PipelineItemPropType } from './constants'
import PipelineDetails from './PipelineDetails'
import GetPipelineData from './GetPipelineData'
import { getPipelineUrl } from './utils'

import TaskForm from '../../../client/components/Task/Form'

const StyledWarningText = styled(WarningText)`
  margin-bottom: ${SPACING.SCALE_5};
`

function DeletePipelineItemForm({ pipelineItemId, currentPipelineItem }) {
  return (
    <>
      <LocalHeader
        heading="Delete project"
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.pipeline.index(), text: 'My Pipeline' },
          { link: null, text: 'Delete project' },
        ]}
      />
      <Main>
        <Task>
          {(getTask) => {
            const deletePipelineItem = getTask(
              TASK_DELETE_PIPELINE_ITEM,
              STATE_ID
            )

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
                    <PipelineDetails
                      item={currentPipelineItem}
                    ></PipelineDetails>
                    <TaskForm
                      id={STATE_ID}
                      submissionTaskName={TASK_DELETE_PIPELINE_ITEM}
                      analyticsFormName="delete-pipeline-item-form"
                      transformPayload={() => ({
                        projectName: currentPipelineItem.name,
                        pipelineItemId,
                      })}
                      redirectTo={() => getPipelineUrl(currentPipelineItem)}
                      flashMessage={() => deletePipelineItem.errorMessage}
                    >
                      <FormActions>
                        <Button buttonColour={RED}>Delete project</Button>
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

DeletePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
}

export default connect(state2props)(DeletePipelineItemForm)
