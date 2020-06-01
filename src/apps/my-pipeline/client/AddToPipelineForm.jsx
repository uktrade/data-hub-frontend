import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorSummary from '@govuk-react/error-summary'
import { StatusMessage } from 'data-hub-components'
import Task from '../../../client/components/Task'
import LoadingBox from '@govuk-react/loading-box'
import ProgressIndicator from '../../../client/components/ProgressIndicator'
import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__ADD_COMPANY_SUCCESS,
} from '../../../client/actions'
import {
  ID as STATE_ID,
  TASK_GET_PIPELINE_BY_COMPANY,
  TASK_ADD_COMPANY_TO_PIPELINE,
} from './state'
import urls from '../../../lib/urls'
import PipelineForm from './PipelineForm'
import { PipelineItemPropType, PipelineItemsPropType } from './constants'
import { getPipelineUrl } from './utils'

function isOnPipeline(pipelineStatus, companyId) {
  if (pipelineStatus?.companyId === companyId) {
    return !!pipelineStatus.count
  }
  return null
}

function PipelineCheck({
  pipelineStatus,
  companyId,
  getPipelineByCompany,
  children,
}) {
  const onPipeline = isOnPipeline(pipelineStatus, companyId)
  useEffect(() => {
    getPipelineByCompany.start({
      payload: { companyId },
      onSuccessDispatch: PIPELINE__CHECKED_IF_ON_PIPELINE,
    })
  }, [companyId])

  if (getPipelineByCompany.error) {
    return (
      <ErrorSummary
        heading="There is a problem"
        description={`Error: ${getPipelineByCompany.errorMessage}`}
        errors={[]}
      />
    )
  }
  if (onPipeline === null) {
    return <ProgressIndicator message="checking pipeline..." />
  }
  return (
    <>
      {onPipeline && (
        <StatusMessage>
          This company is already in your pipeline.
          <br />
          You can add it again under another project name.
        </StatusMessage>
      )}
      {children}
    </>
  )
}

function AddToPipelineForm({
  companyId,
  pipelineStatus,
  savedPipelineItem,
  sectors,
  contacts,
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
        const getPipelineByCompany = getTask(
          TASK_GET_PIPELINE_BY_COMPANY,
          STATE_ID
        )
        const addCompanyToPipeline = getTask(
          TASK_ADD_COMPANY_TO_PIPELINE,
          STATE_ID
        )
        return (
          <>
            <PipelineCheck
              getPipelineByCompany={getPipelineByCompany}
              pipelineStatus={pipelineStatus}
              companyId={companyId}
            >
              <LoadingBox
                loading={addCompanyToPipeline.progress || savedPipelineItem}
              >
                <PipelineForm
                  cancelLink={urls.companies.detail(companyId)}
                  pipelineStatus={pipelineStatus}
                  sectors={sectors}
                  contacts={contacts}
                  onSubmit={(values) => {
                    addCompanyToPipeline.start({
                      payload: { values, companyId },
                      onSuccessDispatch: PIPELINE__ADD_COMPANY_SUCCESS,
                    })
                  }}
                  submissionError={addCompanyToPipeline.errorMessage}
                />
              </LoadingBox>
            </PipelineCheck>
          </>
        )
      }}
    </Task>
  )
}

AddToPipelineForm.propTypes = {
  companyId: PropTypes.string,
  pipelineStatus: PipelineItemsPropType,
  savedId: PipelineItemPropType,
}

export default AddToPipelineForm
