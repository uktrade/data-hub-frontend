import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import { ASSOCIATE_PROJECT_ID, TASK_UPDATE_ASSOCIATED_PROJECT } from './state'
import urls from '../../../../lib/urls'
import { InvestmentResource } from '../../../components/Resource'
import { checkIfAssociatedProjectExists } from './transformers'

const checkIfUpdatingOrRemoving = (checkAssociatedId, associatedProject) =>
  checkAssociatedId
    ? checkIfAssociatedProjectExists(associatedProject)
    : 'Remove associated project'

const EditAssociatedProject = () => {
  const { projectId, associatedProjectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <DefaultLayout
          heading={checkIfUpdatingOrRemoving(
            associatedProjectId,
            project.associatedNonFdiRAndDProject
          )}
          pageTitle={`${checkIfUpdatingOrRemoving(
            associatedProjectId,
            project.associatedNonFdiRAndDProject
          )} - ${project.name} - Projects - Investments`}
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
              text: checkIfUpdatingOrRemoving(
                associatedProjectId,
                project.associatedNonFdiRAndDProject
              ),
            },
          ]}
          useReactRouter={false}
        >
          <Task.Status
            name={TASK_UPDATE_ASSOCIATED_PROJECT}
            id={ASSOCIATE_PROJECT_ID}
            progressMessage={
              associatedProjectId
                ? 'Setting associated project'
                : 'Removing associated project'
            }
            startOnRender={{
              payload: { projectId, associatedProjectId },
            }}
          >
            {() =>
              window.location.assign(
                urls.investments.projects.details(projectId)
              )
            }
          </Task.Status>
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}

export default EditAssociatedProject
