import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { typography } from '@govuk-react/lib'

import NewWindowLink from '../NewWindowLink'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const DocumentsSection = ({ fileBrowserRoot, documentPath }) => {
  return (
    <>
      <StyledSectionHeader data-test="document-heading">
        Documents
      </StyledSectionHeader>
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
