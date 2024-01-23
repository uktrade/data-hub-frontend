import React from 'react'
import { isBoolean, isNumber } from 'lodash'
import { useParams } from 'react-router-dom'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'

import { CHANGE_TYPE_TEXT, TRUE, FALSE, NOT_SET } from './constants'
import EditHistory from '../../../components/EditHistory/EditHistory'
import { InvestmentResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import ProjectLayoutNew from '../../../components/Layout/ProjectLayoutNew'
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

const InvestmentName = (props) => (
  <InvestmentResource.Inline {...props}>
    {(project) => project.name}
  </InvestmentResource.Inline>
)
const ProjectEditHistory = () => {
  const { projectId } = useParams()
  // const projectId = 'asdf'
  return (
    <ProjectLayoutNew
      projectId={projectId}
      projectName={<InvestmentName id={projectId} />}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Edit history' },
      ]}
      pageTitle="Edit history"
    >
      <H2 size={LEVEL_SIZE[3]} data-test="edit-history-heading">
        Edit history
      </H2>
      <EditHistory
        dataEndpoint={urls.investments.editHistory.data(projectId)}
        changeType={CHANGE_TYPE_TEXT}
        getUpdatedBy={getUpdatedBy}
        getValue={getValue}
      />
    </ProjectLayoutNew>
  )
}

export default ProjectEditHistory
