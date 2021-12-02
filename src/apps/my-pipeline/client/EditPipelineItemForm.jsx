import React from 'react'
import PropTypes from 'prop-types'

import { TASK_EDIT_PIPELINE_ITEM } from './state'

import urls from '../../../lib/urls'
import PipelineForm from './PipelineForm'
import { PipelineItemPropType } from './constants'
import { getPipelineUrl } from './utils'
import { Main } from '../../../client/components'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import PipelineItemResource from '../../../client/components/Resource/PipelineItem'

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
    likelihood: String(values.likelihoodToWin),
    sector: sector ? { value: sector.id, label: sector.segment } : undefined,
    contacts: contacts?.map(({ id, name }) => ({ value: id, label: name })),
    export_value: values.potentialValue,
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
            <>
              <PipelineForm
                analyticsFormName="editPipelineItem"
                transformPayload={(values, pipelineItem) => ({
                  values,
                  pipelineItemId,
                  pipelineItem,
                })}
                submissionTaskName={TASK_EDIT_PIPELINE_ITEM}
                initialValues={formatInitialValues(pipelineItem)}
                sectors={sectors}
                contacts={contacts}
                actionLinks={[
                  {
                    href: getPipelineUrl(pipelineItem.status),
                    children: 'Cancel',
                  },
                ]}
                flashMessage={(result) => `You saved changes to ${result.name}`}
                redirectTo={(result) => getPipelineUrl(result.status)}
              />
            </>
          </Main>
        </>
      )}
    </PipelineItemResource>
  )
}

EditPipelineItemForm.propTypes = {
  pipelineItemId: PropTypes.string,
  currentPipeline: PipelineItemPropType,
}

export default EditPipelineItemForm
