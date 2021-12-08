import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import Task from '../../../client/components/Task'
import { PIPELINE__ARCHIVE_ITEM } from '../../../client/actions'

import {
  Main,
  FieldTextarea,
  FormActions,
  MultiInstanceForm,
} from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

import {
  ID as STATE_ID,
  TASK_ARCHIVE_PIPELINE_ITEM,
  state2props,
} from './state'
import { PipelineItemPropType } from './constants'
import PipelineDetails from './PipelineDetails'
import GetPipelineData from './GetPipelineData'
import { getPipelineUrl } from './utils'

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
      window.location.href = getPipelineUrl(savedPipelineItem.status)
    }
  }, [savedPipelineItem])

  return (
    <>
      <LocalHeader
        heading="Archive project"
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.pipeline.index(), text: 'My Pipeline' },
          { link: null, text: 'Archive project' },
        ]}
      />
      <Main>
        <Task>
          {(getTask) => {
            const archivePipelineItem = getTask(
              TASK_ARCHIVE_PIPELINE_ITEM,
              STATE_ID
            )

            return (
              <GetPipelineData
                getTask={getTask}
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
                    <PipelineDetails
                      item={currentPipelineItem}
                    ></PipelineDetails>
                    <MultiInstanceForm
                      id={STATE_ID}
                      onSubmit={(values) => {
                        archivePipelineItem.start({
                          payload: {
                            values,
                            pipelineItemId,
                            projectName: currentPipelineItem.name,
                          },
                          onSuccessDispatch: PIPELINE__ARCHIVE_ITEM,
                        })
                      }}
                      showErrorSummary={false}
                    >
                      <br />
                      <FieldTextarea
                        label="Reason for archive"
                        hint="Details on why you are archiving this project"
                        name="reason"
                        type="text"
                        required="Enter the reason why you are archiving this project"
                        className="govuk-!-width-two-thirds"
                      />
                      <FormActions>
                        <Button>Archive project</Button>
                        <Link href={getPipelineUrl(currentPipelineItem.status)}>
                          Cancel
                        </Link>
                      </FormActions>
                    </MultiInstanceForm>
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

ArchivePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  currentPipeline: PipelineItemPropType,
  savedPipelineItem: PipelineItemPropType,
}

export default connect(state2props)(ArchivePipelineItemForm)
