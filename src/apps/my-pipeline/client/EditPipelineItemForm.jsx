import React from 'react'
import PropTypes from 'prop-types'

import { TASK_EDIT_PIPELINE_ITEM } from './state'

import urls from '../../../lib/urls'
import PipelineForm from './PipelineForm'
import { getPipelineUrl } from './utils'
import { Main } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import PipelineItemResource from '../../../client/components/Resource/PipelineItem'

const {
  formatWithoutParsing,
  isUnparsedDateValid,
  createAndFormatDateObject,
} = require('../../../client/utils/date')

function formatInitialValues(values) {
  const { sector, contacts } = values
  const expectedWinDate = createAndFormatDateObject(values.expectedWinDate)
  return {
    name: values.name,
    category: values.status,
    likelihood: String(values.likelihoodToWin),
    sector: sector ? { value: sector.id, label: sector.segment } : null,
    contacts: contacts?.map(({ id, name }) => ({ value: id, label: name })),
    export_value: values.potentialValue,
    company: values.company,
    expected_win_date: isUnparsedDateValid(expectedWinDate)
      ? {
          month: formatWithoutParsing(expectedWinDate, 'MM'),
          year: formatWithoutParsing(expectedWinDate, 'yyyy'),
        }
      : {
          month: '',
          year: '',
        },
  }
}

function EditPipelineItemForm({ pipelineItemId, contacts, sectors }) {
  return (
    <PipelineItemResource id={pipelineItemId}>
      {(pipelineItem) => (
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
            <PipelineForm
              analyticsFormName="editPipelineItem"
              transformPayload={(values) => ({
                values,
                pipelineItemId,
              })}
              submissionTaskName={TASK_EDIT_PIPELINE_ITEM}
              initialValues={formatInitialValues(pipelineItem)}
              sectors={sectors}
              contacts={contacts}
              cancelRedirectTo={() => getPipelineUrl(pipelineItem.status)}
              flashMessage={(result) => `You saved changes to ${result.name}`}
              redirectTo={(result) => getPipelineUrl(result.status)}
            />
          </Main>
        </>
      )}
    </PipelineItemResource>
  )
}

EditPipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string.isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  sectors: PropTypes.array,
}

export default EditPipelineItemForm
