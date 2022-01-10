import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { RED } from 'govuk-colours'
import WarningText from '@govuk-react/warning-text'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'

import { Main } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import Form from '../../../client/components/Form'
import PipelineItemResource from '../../../client/components/Resource/PipelineItem'

import { ID as STATE_ID, TASK_DELETE_PIPELINE_ITEM } from './state'
import PipelineDetails from './PipelineDetails'
import { getPipelineUrl } from './utils'

const StyledWarningText = styled(WarningText)`
  margin-bottom: ${SPACING.SCALE_5};
`

const DeletePipelineItemForm = ({ pipelineItemId }) => (
  <PipelineItemResource id={pipelineItemId}>
    {(pipelineItem) => (
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
          <StyledWarningText>
            Deleting this project will remove all project details from your
            pipeline.
          </StyledWarningText>
          <PipelineDetails item={pipelineItem}></PipelineDetails>
          <Form
            id={STATE_ID}
            analyticsFormName="deletePipelineItem"
            submissionTaskName={TASK_DELETE_PIPELINE_ITEM}
            transformPayload={(values) => ({
              values,
              pipelineItemId,
            })}
            redirectTo={() => getPipelineUrl(pipelineItem.status)}
            submitButtonLabel={'Delete project'}
            cancelRedirectTo={() => getPipelineUrl(pipelineItem.status)}
            flashMessage={() =>
              `You deleted ${pipelineItem.name} from your pipeline`
            }
            submitButtonColour={RED}
          />
        </Main>
      </>
    )}
  </PipelineItemResource>
)

DeletePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
}

export default DeletePipelineItemForm
