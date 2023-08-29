import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, H2, Link, ListItem, Table, UnorderedList } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'

import { InvestmentEvidenceResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { VIRUS_SCAN_STATUSES } from './constants'

const StyledListItem = styled(ListItem)`
  font-size: 16px;
`

const ProjectEvidence = ({ projectId }) => (
  <InvestmentEvidenceResource id={projectId}>
    {(evidence) => (
      <>
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
                      <Link
                        href={urls.investments.projects.evidence.download(
                          projectId,
                          document.id
                        )}
                      >
                        Download
                      </Link>
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
      </>
    )}
  </InvestmentEvidenceResource>
)

ProjectEvidence.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default ProjectEvidence
