import React from 'react'
import { isBoolean, isNumber } from 'lodash'
import { useParams } from 'react-router-dom'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'

import { CHANGE_TYPE_TEXT, TRUE, FALSE, NOT_SET } from './constants'
import EditHistory from '../../../components/EditHistory/EditHistory'
import { InvestmentResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import ProjectLayout from '../../../components/Layout/ProjectLayout'
import { formatMediumDateTime, isDateValid } from '../../../utils/date'

function getValue(value) {
  if (isBoolean(value)) {
    return value ? TRUE : FALSE
  }

  if (isNumber(value)) {
    // TODO: update with currency fields when confirmed (see CompanyEditHistory.jsx)
    return value.toString()
  }

  if (isDateValid(value)) {
    return formatMediumDateTime(value)
  }

  return value || NOT_SET
}

function getUpdatedBy(timestamp, changedBy) {
  const formattedTime = formatMediumDateTime(timestamp)
  return `Updated on ${formattedTime} by ${changedBy}`
}

const ProjectEditHistory = () => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <ProjectLayout
          project={project}
          breadcrumbs={[
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            { text: 'Edit history' },
          ]}
          pageTitle="Edit history"
        >
          <H2 size={LEVEL_SIZE[3]} data-test="edit-history-heading">
            Edit history
          </H2>
          <EditHistory
            dataEndpoint={urls.investments.editHistory.data(project.id)}
            changeType={CHANGE_TYPE_TEXT}
            getUpdatedBy={getUpdatedBy}
            getValue={getValue}
          />
        </ProjectLayout>
      )}
    </InvestmentResource>
  )
}

export default ProjectEditHistory
