import { connect } from 'react-redux'
import React, { useEffect } from 'react'
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
import { formatDate, DATE_FORMAT_FULL } from '../../../../utils/date-utils'
import { buildProjectBreadcrumbs } from '../../utils'
import { ID, TASK_PROPOSITION_COMPLETE, propositionState2props } from '../state'
import { PROPOSITION_COMPLETE } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task'

const buildHeading = (index) => {
  index++
  return 'File ' + index
}

const checkStatus = (status) => status === 'ongoing' || status === 'late'

const getUploadText = (evidenceCount) =>
  evidenceCount > 0 ? 'Upload another file' : 'Upload files'

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

const PropositionDetails = ({
  propositionId,
  investmentProjectId,
  completeStatus,
}) => {
  useEffect(() => {
    if (completeStatus === 'completed') {
      window.location.href =
        urls.investments.projects.propositions(investmentProjectId)
    }
  }, [completeStatus, investmentProjectId])

  return (
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
                        value={formatDate(
                          proposition.createdOn,
                          DATE_FORMAT_FULL
                        )}
                      />
                      <SummaryTable.TextRow
                        heading="Modified on"
                        value={formatDate(
                          proposition.modifiedOn,
                          DATE_FORMAT_FULL
                        )}
                      />
                      <SummaryTable.TextRow
                        heading="Deadline"
                        value={formatDate(
                          proposition.deadline,
                          DATE_FORMAT_FULL
                        )}
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
                          href={urls.investments.projects.proposition.document.index(
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
                          <Task>
                            {(getTask) => {
                              const postCompleteTask = getTask(
                                TASK_PROPOSITION_COMPLETE,
                                ID
                              )
                              const handleCompleteTask = () => {
                                postCompleteTask.start({
                                  payload: {
                                    investmentProjectId: investmentProjectId,
                                    propositionId: propositionId,
                                  },
                                  onSuccessDispatch: PROPOSITION_COMPLETE,
                                })
                              }
                              return (
                                <div>
                                  <Button
                                    onClick={handleCompleteTask}
                                    data-test="complete-button"
                                  >
                                    Complete proposition
                                  </Button>
                                </div>
                              )
                            }}
                          </Task>
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
}
PropositionDetails.propTypes = {
  investmentProjectId: PropTypes.string.isRequired,
  propositionId: PropTypes.string.isRequired,
}

export default connect(propositionState2props)(PropositionDetails)
