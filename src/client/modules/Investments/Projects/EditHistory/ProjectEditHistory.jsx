import React from 'react'
import { useParams } from 'react-router-dom'

import urls from '../../../../../lib/urls'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'
import { ProjectAuditHistoryResource } from '../../../../components/Resource'
import { transformAuditResponseToCollection } from './transformers'
import { CollectionItem } from '../../../../components'

const ProjectEditHistory = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Edit history' },
      ]}
      pageTitle="Edit history"
    >
      <ProjectAuditHistoryResource.Paginated
        id={`v3/investment/${projectId}/audit`}
      >
        {(projectAuditHistory) => (
          <ul>
            {transformAuditResponseToCollection(projectAuditHistory).map(
              (item) => (
                <CollectionItem
                  key={item.id}
                  headingText={item.headingText}
                  metadata={item.metadata}
                  badges={item.badges}
                />
              )
            )}
          </ul>
        )}
      </ProjectAuditHistoryResource.Paginated>
    </ProjectLayoutNew>
  )
}

export default ProjectEditHistory
