import React from 'react'

import { SectionHeader } from '../../components'

const DocumentsSection = () => {
  return (
    <>
      <SectionHeader type="document">Documents</SectionHeader>
      <p data-test="no-documents-message">There are no files or documents</p>
    </>
  )
}

export default DocumentsSection
