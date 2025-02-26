import React from 'react'
import { useParams } from 'react-router-dom'

import urls from '../../../../../lib/urls'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'
import { ProjectAuditHistoryResource } from '../../../../components/Resource'
import { getValue, mapFieldNameToLabel } from './transformers'
import { AuditHistory } from '../../../../components'

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
      <AuditHistory
        resource={ProjectAuditHistoryResource}
        id={projectId}
        valueTransformer={getValue}
        fieldMapper={mapFieldNameToLabel}
        auditType="the project"
        showSort={false}
      />
    </ProjectLayoutNew>
  )
}

export default ProjectEditHistory
