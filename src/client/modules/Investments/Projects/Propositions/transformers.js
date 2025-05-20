import React from 'react'
import styled from 'styled-components'

import { formatDateWithYearMonth } from '../../../../utils/date'
import { getVirusStatusDisplayFromLabel } from '../constants'

import urls from '../../../../../lib/urls'
import AccessibleLink from '../../../../components/Link'

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
    deadline: formatDateWithYearMonth(proposition_deadline),
  }
}

export const transformAbandonedPropositionForAPI = ({
  projectId,
  propositionId,
  values,
}) => {
  return {
    propositionId,
    projectId,
    details: values.reason,
  }
}

const StyledSpan = styled('span')`
  padding-left: 10px;
`
const buildDocumentLink = (
  avClean,
  documentId,
  propositionId,
  projectId,
  originalFilename
) => (
  <>
    {avClean ? (
      <AccessibleLink
        href={`/investments/projects/${projectId}/propositions/${propositionId}/download/${documentId}`}
        aria-label={`Download the document ${originalFilename}`}
      >
        Download
      </AccessibleLink>
    ) : (
      <strong>
        The file didn't pass virus scanning, contact your administrator
      </strong>
    )}
    <StyledSpan>
      <AccessibleLink
        href={urls.investments.projects.proposition.document.delete(
          projectId,
          propositionId,
          documentId
        )}
        data-test="delete-link"
      >
        Delete
      </AccessibleLink>
    </StyledSpan>
  </>
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
      : getVirusStatusDisplayFromLabel(status)
  return documentStatus
}

export const transformPropositionEvidenceForApi = (values) => ({
  file: values.document_upload[0],
})
