import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'

import ErrorSummary from '@govuk-react/error-summary'
import Task from '../../../client/components/Task'
import ProgressIndicator from '../../../client/components/ProgressIndicator'
import { PIPELINE__CHECKED_IF_ON_PIPELINE } from '../../../client/actions'
import {
  ID as STATE_ID,
  TASK_GET_PIPELINE_BY_COMPANY,
  TASK_ADD_COMPANY_TO_PIPELINE,
} from './state'
import urls from '../../../lib/urls'
import PipelineForm from './PipelineForm'
import {
  PipelineItemPropType,
  PipelineItemsPropType,
  STATUS_VALUES,
} from './constants'
import { getPipelineUrl } from './utils'

import { Main, StatusMessage } from '../../../client/components/'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'

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
          You've already added this company to the following{' '}
          {pluralize('projects', pipelineStatus.count, true)}:
          <br />
          <br />
          <ul>
            {pipelineStatus.results.map((project) => (
              <li key={project.id}>
                {project.name} -{' '}
                {STATUS_VALUES.filter(
                  (status) => status.value === project.status
                ).map((status) => status.label)}
              </li>
            ))}
          </ul>
        </StatusMessage>
      )}
      {children}
    </>
  )
}

function AddPipelineItemForm({
  companyName,
  companyId,
  pipelineStatus,
  sectors,
  contacts,
}) {
  return (
    <>
      <LocalHeader
        heading={`Add ${companyName} to your pipeline`}
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          {
            link: urls.companies.index(),
            text: 'Companies',
          },
          { link: urls.companies.detail(companyId), text: companyName },
          { link: null, text: 'Add to your pipeline' },
        ]}
      />
      <Main>
        <Task>
          {(getTask) => {
            const getPipelineByCompany = getTask(
              TASK_GET_PIPELINE_BY_COMPANY,
              STATE_ID
            )
            return (
              <>
                <PipelineCheck
                  getPipelineByCompany={getPipelineByCompany}
                  pipelineStatus={pipelineStatus}
                  companyId={companyId}
                >
                  <PipelineForm
                    companyName={companyName}
                    companyId={companyId}
                    pipelineStatus={pipelineStatus}
                    sectors={sectors}
                    contacts={contacts}
                    submissionTaskName={TASK_ADD_COMPANY_TO_PIPELINE}
                    transformPayload={(values) => ({
                      values,
                      companyId,
                    })}
                    analyticsFormName="addCompanyToPipeline"
                    redirectTo={(result) => getPipelineUrl(result.status)}
                    flashMessage={() =>
                      `You added ${companyName} to your pipeline`
                    }
                    submitButtonLabel="Create project"
                    actionLinks={[
                      {
                        href: urls.companies.detail(companyId),
                        children: 'Cancel',
                      },
                    ]}
                  />
                </PipelineCheck>
              </>
            )
          }}
        </Task>
      </Main>
    </>
  )
}

AddPipelineItemForm.propTypes = {
  companyName: PropTypes.string,
  companyId: PropTypes.string,
  pipelineStatus: PipelineItemsPropType,
  savedId: PipelineItemPropType,
}

export default AddPipelineItemForm
