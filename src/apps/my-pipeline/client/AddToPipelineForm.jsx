import React, { useEffect } from 'react'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import ErrorSummary from '@govuk-react/error-summary'
import { StatusMessage } from 'data-hub-components'
import {
  FormStateful,
  FieldRadios,
  FormActions,
  FieldInput,
} from 'data-hub-components'
import { connect } from 'react-redux'
import Task from '../../../../../client/components/Task'
import LoadingBox from '@govuk-react/loading-box'
import ProgressIndicator from '../../../../../client/components/ProgressIndicator'
import {
  PIPELINE__CHECKED_IF_ON_PIPELINE,
  PIPELINE__ADD_COMPANY_SUCCESS,
} from '../../../../../client/actions'
import {
  state2props,
  ID as STATE_ID,
  TASK_GET_PIPELINE_BY_COMPANY,
  TASK_ADD_COMPANY_TO_PIPELINE,
} from './state'
import urls from '../../../../../lib/urls'

function isOnPipeline(pipelineStatus, companyId) {
  if (pipelineStatus?.companyId === companyId) {
    return !!pipelineStatus.count
  }
  return null
}
function PipelineCheck({
  pipelineStatus,
  companyName,
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
        description={`There was an error checking the status of ${companyName}`}
        errors={[getPipelineByCompany.errorMessage]}
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
  companyName,
  pipelineStatus,
  csrfToken,
  savedId,
}) {
  useEffect(() => {
    if (savedId) {
      /**
       * TODO: Replace with react router navigation.
       * As we move to SPA clear the saveId from the state before navigation.
       */
      window.location.href = urls.pipeline.index()
    }
  }, [savedId])

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
            {addCompanyToPipeline.error && (
              <ErrorSummary
                heading="There is a problem"
                description={`There was an error adding ${companyName} to a pipeline`}
                errors={[addCompanyToPipeline.errorMessage]}
              />
            )}
            <PipelineCheck
              getPipelineByCompany={getPipelineByCompany}
              pipelineStatus={pipelineStatus}
              companyId={companyId}
              companyName={companyName}
            >
              <LoadingBox loading={addCompanyToPipeline.progress}>
                <FormStateful
                  onSubmit={(values) => {
                    addCompanyToPipeline.start({
                      payload: { values, companyId, csrfToken },
                      onSuccessDispatch: PIPELINE__ADD_COMPANY_SUCCESS,
                    })
                  }}
                  submissionError={addCompanyToPipeline.errorMessage}
                >
                  <FieldInput
                    name="name"
                    label="Project name"
                    type="text"
                    required="Enter a Project name"
                  />
                  <FieldRadios
                    name="category"
                    label="Choose a status"
                    required="Choose a status"
                    options={[
                      { value: 'leads', label: 'Lead' },
                      { value: 'in_progress', label: 'In progress' },
                      { value: 'win', label: 'Win' },
                    ]}
                  />
                  <FormActions>
                    <Button>Add</Button>
                    <Link href={urls.companies.detail(companyId)}>Cancel</Link>
                  </FormActions>
                </FormStateful>
              </LoadingBox>
            </PipelineCheck>
          </>
        )
      }}
    </Task>
  )
}

export default connect(state2props)(AddToPipelineForm)
