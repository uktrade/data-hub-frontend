import React from 'react'
import PropTypes from 'prop-types'
import { Button, Link } from 'govuk-react'

import { LocalHeader, Main, SummaryTable } from '../../../../components'
import {
  InvestmentResource,
  PropositionResource,
  PropositionEvidenceResource,
} from '../../../../components/Resource'
import {
  buildPropositionUrl,
  buildEvidenceUrl,
  capitaliseFirstLetter,
  transformDocumentStatus,
} from './transformers'
import urls from '../../../../../lib/urls'
import { formatLongDate } from '../../../../utils/date'
import { buildProjectBreadcrumbs } from '../../utils'

const buildHeading = (index) => {
  index++
  return 'File ' + index
}

const checkStatus = (status) => status === 'ongoing' || status === 'late'

const getUploadText = (evidenceCount) =>
  evidenceCount > 0 ? 'Upload more files' : 'Upload files'

const transformFilesResultsForTable = (evidence, propositionId, projectId) =>
  evidence.map(({ originalFilename, status, avClean, id }, index) => (
    <SummaryTable.Row heading={buildHeading(index)}>
      {originalFilename}
      {transformDocumentStatus(
        originalFilename,
        status,
        avClean,
        id,
        propositionId,
        projectId
      )}
    </SummaryTable.Row>
  ))

const PropositionDetails = ({ propositionId, investmentProjectId }) => (
  <InvestmentResource id={investmentProjectId}>
    {(project) => (
      <PropositionResource
        id={buildPropositionUrl(propositionId, investmentProjectId)}
      >
        {(proposition) => (
          <PropositionEvidenceResource
            id={buildEvidenceUrl(propositionId, investmentProjectId)}
          >
            {(evidence) => (
              <>
                <LocalHeader
                  heading={proposition.name}
                  breadcrumbs={buildProjectBreadcrumbs([
                    {
                      link: urls.investments.projects.details(project.id),
                      text: project.name,
                    },
                    {
                      text: proposition.name,
                    },
                  ])}
                />
                <Main>
                  <SummaryTable data-test="proposition-details-table">
                    <SummaryTable.TextRow
                      heading="Scope"
                      value={proposition.scope}
                    />
                    <SummaryTable.TextRow
                      heading="Status"
                      value={capitaliseFirstLetter(proposition.status)}
                    />
                    <SummaryTable.TextRow
                      heading="Date created"
                      value={formatLongDate(proposition.createdOn)}
                    />
                    <SummaryTable.TextRow
                      heading="Modified on"
                      value={formatLongDate(proposition.modifiedOn)}
                    />
                    <SummaryTable.TextRow
                      heading="Deadline"
                      value={formatLongDate(proposition.deadline)}
                    />
                    <SummaryTable.TextRow
                      heading="Assigned to"
                      value={proposition.adviser.name}
                    />
                    {proposition.details && (
                      <SummaryTable.TextRow
                        heading="Details"
                        value={proposition.details}
                      />
                    )}
                    {evidence.count > 0 &&
                      transformFilesResultsForTable(
                        evidence.results,
                        propositionId,
                        investmentProjectId
                      )}
                  </SummaryTable>
                  {checkStatus(proposition.status) && (
                    <>
                      <Link
                        href={urls.investments.projects.proposition.document(
                          investmentProjectId,
                          propositionId
                        )}
                        data-test="upload-link"
                      >
                        {getUploadText(evidence.count)}
                      </Link>
                      <br />
                      <br />
                      {evidence.count > 0 && (
                        <Button
                          as={Link}
                          href={urls.investments.projects.proposition.complete(
                            investmentProjectId,
                            propositionId
                          )}
                          data-test="complete-button"
                        >
                          Complete proposition
                        </Button>
                      )}
                      <br />
                      <Link
                        href={urls.investments.projects.proposition.abandon(
                          investmentProjectId,
                          propositionId
                        )}
                        data-test="abandon-link"
                      >
                        Abandon proposition
                      </Link>
                      <br />
                      <br />
                      <Link
                        href={urls.investments.projects.propositions(
                          investmentProjectId
                        )}
                        data-test="proposition-list-link"
                      >
                        View propositions list
                      </Link>
                      <br />
                      <br />
                    </>
                  )}
                </Main>
              </>
            )}
          </PropositionEvidenceResource>
        )}
      </PropositionResource>
    )}
  </InvestmentResource>
)
PropositionDetails.propTypes = {
  investmentProjectId: PropTypes.string.isRequired,
  propositionId: PropTypes.string.isRequired,
}

export default PropositionDetails
