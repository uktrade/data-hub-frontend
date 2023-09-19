import React from 'react'
import styled from 'styled-components'
import { Button, H2, Link, ListItem, Table, UnorderedList } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import {
  InvestmentResource,
  InvestmentEvidenceResource,
  ProjectDocumentResource,
} from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import { VIRUS_SCAN_STATUSES } from '../constants'
import ProjectLayout from '../../../../components/Layout/ProjectLayout'

const StyledListItem = styled(ListItem)`
  font-size: 16px;
`
const ProjectEvidence = () => {
  const { projectId } = useParams()
  return (
    <InvestmentEvidenceResource id={projectId}>
      {(evidence) => (
        <InvestmentResource id={projectId}>
          {(project) => (
            <ProjectLayout
              project={project}
              breadcrumbs={[
                {
                  link: urls.investments.projects.details(project.id),
                  text: project.name,
                },
                { text: 'Evidence' },
              ]}
              pageTitle="Evidence"
            >
              <H2 size={LEVEL_SIZE[3]} data-test="evidence-heading">
                Evidence
              </H2>
              {evidence.count > 0 && (
                <Table data-test="evidence-table">
                  <Table.Row>
                    <Table.CellHeader setWidth="50%">
                      Verification criteria
                    </Table.CellHeader>
                    <Table.CellHeader>Comment</Table.CellHeader>
                    <Table.CellHeader />
                    <Table.CellHeader />
                  </Table.Row>
                  {evidence.results.map((document) => (
                    <Table.Row>
                      <Table.Cell>
                        {document.tags.map((tag, i) => (
                          <UnorderedList listStyleType="bullet">
                            <StyledListItem key={i}>{tag.name}</StyledListItem>
                          </UnorderedList>
                        ))}
                      </Table.Cell>
                      <Table.Cell>{document.comment}</Table.Cell>
                      <Table.Cell>
                        {document.avClean ? (
                          document.status === 'virus_scanned' ? (
                            <ProjectDocumentResource id={document.url.slice(1)}>
                              {(documentDownload) => (
                                <Link
                                  href={documentDownload.documentUrl}
                                  data-test="download-link"
                                >
                                  Download
                                </Link>
                              )}
                            </ProjectDocumentResource>
                          ) : (
                            VIRUS_SCAN_STATUSES[document.status]
                          )
                        ) : (
                          <strong>
                            The file didn't pass virus scanning, contact your
                            administrator
                          </strong>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {
                          <Link
                            href={urls.investments.projects.evidence.delete(
                              projectId,
                              document.id
                            )}
                            data-test="delete-link"
                          >
                            Delete
                          </Link>
                        }
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table>
              )}
              <Button
                as={Link}
                href={urls.investments.projects.evidence.add(projectId)}
                data-test="add-evidence-button"
              >
                Add new evidence
              </Button>
            </ProjectLayout>
          )}
        </InvestmentResource>
      )}
    </InvestmentEvidenceResource>
  )
}

export default ProjectEvidence
