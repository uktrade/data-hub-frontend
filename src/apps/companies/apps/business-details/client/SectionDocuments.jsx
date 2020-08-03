import React from 'react'
import PropTypes from 'prop-types'

import { NewWindowLink, SummaryTable } from '../../../../../client/components/'

const SectionDocuments = ({ urls }) =>
  urls.archivedDocument ? (
    <SummaryTable
      caption="Documents from CDMS"
      data-auto-id="documentsDetailsContainer"
    >
      <SummaryTable.Row>
        <NewWindowLink href={urls.archivedDocument}>
          View files and documents
        </NewWindowLink>
      </SummaryTable.Row>
    </SummaryTable>
  ) : null

SectionDocuments.propTypes = {
  urls: PropTypes.object.isRequired,
}

export default SectionDocuments
