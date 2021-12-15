import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import PipelineItemResource from '../../../client/components/Resource/PipelineItem'

import urls from '../../../lib/urls'
import TaskForm from '../../../client/components/Task/Form'

import { Main, FieldTextarea } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

import { ID as STATE_ID, TASK_ARCHIVE_PIPELINE_ITEM } from './state'
import PipelineDetails from './PipelineDetails'
import { getPipelineUrl } from './utils'

const StyledP = styled.p`
  margin: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_5} 0;
`

const ArchivePipelineItemForm = ({ pipelineItemId }) => (
  <PipelineItemResource id={pipelineItemId}>
    {(pipelineItem) => (
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
          <StyledP>
            Archive this project if it’s no longer required or active.
            <br />
            You can unarchive or delete an archived project from your pipeline
            dashboard.
          </StyledP>
          <PipelineDetails item={pipelineItem}></PipelineDetails>
          <TaskForm
            id={STATE_ID}
            analyticsFormName="archivePipelineItem"
            submissionTaskName={TASK_ARCHIVE_PIPELINE_ITEM}
            transformPayload={(values) => ({
              values,
              pipelineItemId,
            })}
            redirectTo={(result) => getPipelineUrl(result.status)}
            submitButtonLabel={'Archive project'}
            actionLinks={[
              {
                href: getPipelineUrl(pipelineItem.status),
                children: 'Cancel',
              },
            ]}
            flashMessage={() => `You archived ${pipelineItem.name}`}
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
          </TaskForm>
        </Main>
      </>
    )}
  </PipelineItemResource>
)

ArchivePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
}

export default ArchivePipelineItemForm
