import React from 'react'
import PropTypes from 'prop-types'

import { NewWindowLink, SectionHeader } from '../../components'

const DocumentsSection = ({ fileBrowserRoot, documentPath }) => {
  return (
    <>
      <SectionHeader type="document">Documents</SectionHeader>
      {documentPath ? (
        <NewWindowLink
          href={fileBrowserRoot + documentPath}
          data-test="document-link"
        >
          View files and documents
        </NewWindowLink>
      ) : (
        <p data-test="no-documents-message">There are no files or documents</p>
      )}
    </>
  )
}

DocumentsSection.propTypes = {
  fileBrowserRoot: PropTypes.string.isRequired,
  documentPath: PropTypes.string.isRequired,
}

export default DocumentsSection
