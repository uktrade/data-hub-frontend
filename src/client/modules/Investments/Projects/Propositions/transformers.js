import React from 'react'
import { Link } from 'govuk-react'
import { transformValueForAPI } from '../../../../utils/date'

import { VIRUS_SCAN_STATUSES } from '../constants'

export const buildPropositionUrl = (propositionId, projectId) =>
  `v3/investment/${projectId}/proposition/${propositionId}`

export const buildEvidenceUrl = (propositionId, projectId) =>
  buildPropositionUrl(propositionId, projectId) + '/document'

export const capitaliseFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const transformPropositionForAPI = ({ projectId, values }) => {
  const {
    proposition_name,
    proposition_scope,
    proposition_assignee,
    proposition_deadline,
  } = values

  return {
    investment_project: projectId,
    name: proposition_name,
    scope: proposition_scope,
    adviser: proposition_assignee.value,
    deadline_day: proposition_deadline.day,
    deadline_month: proposition_deadline.month,
    deadline_year: proposition_deadline.year,
    deadline: transformValueForAPI(proposition_deadline),
  }
}

export const transformAbandonedPropositionForAPI = ({
  investmentProjectId,
  propositionId,
  values,
}) => {
  return {
    propositionId,
    investmentProjectId,
    details: values.reason,
  }
}

const buildDocumentLink = (
  avClean,
  documentId,
  propositionId,
  projectId,
  originalFilename
) =>
  avClean ? (
    <Link
      href={`/investments/projects/${projectId}/propositions/${propositionId}/download/${documentId}`}
      aria-label={`Download the document ${originalFilename}`}
    >
      Download
    </Link>
  ) : (
    <strong>
      The file didn't pass virus scanning, contact your administrator
    </strong>
  )

export const transformDocumentStatus = (
  originalFilename,
  status,
  avClean,
  id,
  propositionId,
  projectId
) => {
  const documentStatus =
    status === 'virus_scanned'
      ? buildDocumentLink(
          avClean,
          id,
          propositionId,
          projectId,
          originalFilename
        )
      : VIRUS_SCAN_STATUSES[status]
  return documentStatus
}
