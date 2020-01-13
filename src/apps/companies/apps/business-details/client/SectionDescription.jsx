import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from 'data-hub-components'

const SectionDescription = ({ businessDetails, isArchived, urls }) => (
  <SummaryTable
    caption="Description"
    data-auto-id="descriptionDetailsContainer"
    actions={
      !isArchived && <Link href={`${urls.companyEdit}#description`}>Edit</Link>
    }
  >
    <SummaryTable.Row>
      {businessDetails.description || 'No description has been added'}
    </SummaryTable.Row>
  </SummaryTable>
)

SectionDescription.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionDescription
