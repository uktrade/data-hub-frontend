import React from 'react'

import InvestmentResource from '../../../../client/components/Resource/Investment'
import DocumentsSection from '../../../../client/components/DocumentsSection'

const InvestmentDocuments = ({ projectId, archivedDocumentPath }) => {
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <DocumentsSection
          fileBrowserRoot={archivedDocumentPath}
          documentPath={project.archivedDocumentsUrlPath}
        />
      )}
    </InvestmentResource>
  )
}

export default InvestmentDocuments
