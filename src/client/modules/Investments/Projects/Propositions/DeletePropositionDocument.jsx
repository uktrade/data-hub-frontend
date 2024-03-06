import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import { DefaultLayout } from '../../../../components'
import Task from '../../../../components/Task'
import {
  DELETE_PROPOSITION_DOCUMENT_ID,
  TASK_DELETE_PROPOSITION_DOCUMENT,
} from './state'
import urls from '../../../../../lib/urls'
import { InvestmentResource } from '../../../../components/Resource'
import { buildProjectBreadcrumbs } from '../../utils'

const DeletePropositionDocument = () => {
  const { projectId, propositionId, documentId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <DefaultLayout
          heading={'Deleting proposition document'}
          pageTitle={`Delete proposition document - ${project.name} - Projects - Investments`}
          breadcrumbs={buildProjectBreadcrumbs([
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            {
              link: urls.investments.projects.proposition.details(project.id),
              text: 'Proposition',
            },
            {
              text: 'Delete proposition document',
            },
          ])}
          useReactRouter={false}
        >
          <Task.Status
            name={TASK_DELETE_PROPOSITION_DOCUMENT}
            id={DELETE_PROPOSITION_DOCUMENT_ID}
            progressMessage={'Deleting proposition document'}
            startOnRender={{
              payload: { projectId, propositionId, documentId },
            }}
          >
            {() =>
              window.location.assign(
                urls.investments.projects.proposition.details(
                  projectId,
                  propositionId
                )
              )
            }
          </Task.Status>
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}

export default DeletePropositionDocument
