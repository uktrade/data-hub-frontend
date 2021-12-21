import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'

import { Main } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import TaskForm from '../../../client/components/Form'
import PipelineItemResource from '../../../client/components/Resource/PipelineItem'

import { ID as STATE_ID, TASK_UNARCHIVE_PIPELINE_ITEM } from './state'
import PipelineDetails from './PipelineDetails'
import { getPipelineUrl } from './utils'

const StyledP = styled.p`
  margin: ${SPACING.SCALE_2} 0 ${SPACING.SCALE_5} 0;
`

const UnarchivePipelineItemForm = ({ pipelineItemId }) => (
  <PipelineItemResource id={pipelineItemId}>
    {(pipelineItem) => (
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
          <StyledP>
            Unarchiving this project will restore these project details in your
            pipeline.
          </StyledP>
          <PipelineDetails item={pipelineItem}></PipelineDetails>
          <TaskForm
            id={STATE_ID}
            analyticsFormName="unarchivePipelineItem"
            submissionTaskName={TASK_UNARCHIVE_PIPELINE_ITEM}
            transformPayload={(values) => ({
              values,
              pipelineItemId,
            })}
            redirectTo={(result) => getPipelineUrl(result.status)}
            submitButtonLabel={'Unarchive project'}
            cancelRedirectTo={() => getPipelineUrl(pipelineItem.status)}
            flashMessage={() => `You unarchived ${pipelineItem.name}`}
          />
        </Main>
      </>
    )}
  </PipelineItemResource>
)

UnarchivePipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
}

export default UnarchivePipelineItemForm
