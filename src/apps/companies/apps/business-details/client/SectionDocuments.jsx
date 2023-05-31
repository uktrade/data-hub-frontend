import React from 'react'

import { NewWindowLink, SummaryTable } from '../../../../../client/components/'

const SectionDocuments = ({ archivedDocumentUrl }) =>
  archivedDocumentUrl ? (
    <SummaryTable
      caption="Documents from CDMS"
      data-test="documentsDetailsContainer"
    >
      <SummaryTable.Row>
        <NewWindowLink href={archivedDocumentUrl}>
          View files and documents
        </NewWindowLink>
      </SummaryTable.Row>
    </SummaryTable>
  ) : null

export default SectionDocuments
