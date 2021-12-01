import React from 'react'
import PropTypes from 'prop-types'

import { TASK_EDIT_PIPELINE_ITEM, TASK_GET_PIPELINE_ITEM } from './state'

import urls from '../../../lib/urls'
import PipelineForm from './PipelineForm'
import { PipelineItemPropType } from './constants'
import { getPipelineUrl } from './utils'
import { Main } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

const {
  format,
  isDateValid,
  createAndFormatDateObject,
} = require('../../../client/utils/date')

function formatInitialValues(values) {
  const { sector, contacts } = values
  const expectedWinDate = createAndFormatDateObject(values.expected_win_date)
  return {
    name: values.name,
    category: values.status,
    likelihood: String(values.likelihood_to_win),
    sector: sector ? { value: sector.id, label: sector.segment } : null,
    contacts: contacts?.map(({ id, name }) => ({ value: id, label: name })),
    export_value: values.potential_value,
    company: values.company,
    expected_win_date: isDateValid(expectedWinDate)
      ? {
          month: format(expectedWinDate, 'MM'),
          year: format(expectedWinDate, 'yyyy'),
        }
      : {
          month: '',
          year: '',
        },
  }
}

function EditPipelineItemForm({ pipelineItemId, contacts, sectors }) {
  return (
    <>
      <LocalHeader
        heading="Edit project"
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.pipeline.index(), text: 'My Pipeline' },
          {
            text: 'Edit project',
          },
        ]}
      />
      <Main>
        <>
          <PipelineForm
            analyticsFormName="editPipelineItem"
            transformPayload={(values) => ({
              values,
              pipelineItemId,
            })}
            submissionTaskName={TASK_EDIT_PIPELINE_ITEM}
            initialValuesPayload={{ pipelineItemId }}
            initialValuesTaskName={TASK_GET_PIPELINE_ITEM}
            transformInitialValues={(initialValues) =>
              formatInitialValues(initialValues)
            }
            sectors={sectors}
            contacts={contacts}
            flashMessage={(result) => `You saved changes to ${result.name}`}
            redirectTo={(result) => getPipelineUrl(result.status)}
          />
        </>
      </Main>
    </>
  )
}

EditPipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string,
  currentPipeline: PipelineItemPropType,
}

export default EditPipelineItemForm
