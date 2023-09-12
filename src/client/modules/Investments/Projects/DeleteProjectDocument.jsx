import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import { DELETE_DOCUMENT_ID, TASK_DELETE_PROJECT_DOCUMENT } from './state'
import urls from '../../../../lib/urls'
import { InvestmentResource } from '../../../components/Resource'

const DeleteProjectDocument = () => {
  const { projectId, documentId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <DefaultLayout
          heading={'Deleting evidence document'}
          pageTitle={`Delete evidence document - ${project.name} - Projects - Investments`}
          breadcrumbs={[
            { link: urls.dashboard.index(), text: 'Home' },
            {
              link: urls.investments.index(),
              text: 'Investments',
            },
            {
              link: urls.investments.projects.index(),
              text: 'Projects',
            },
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            {
              link: urls.investments.projects.evidence.index(project.id),
              text: 'Evidence',
            },
            {
              text: 'Delete evidence document',
            },
          ]}
          useReactRouter={false}
        >
          <Task.Status
            name={TASK_DELETE_PROJECT_DOCUMENT}
            id={DELETE_DOCUMENT_ID}
            progressMessage={'Deleting evidence document'}
            startOnRender={{
              payload: { projectId, documentId },
            }}
          >
            {() =>
              window.location.assign(
                urls.investments.projects.evidence.index(projectId)
              )
            }
          </Task.Status>
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}

export default DeleteProjectDocument
