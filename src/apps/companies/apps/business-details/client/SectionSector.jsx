import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from '../../../../../client/components/'

const SectionSector = ({ businessDetails, isArchived, urls }) => (
  <SummaryTable
    caption="DIT sector"
    data-auto-id="sectorDetailsContainer"
    actions={
      !isArchived && <Link href={`${urls.companyEdit}#sector`}>Edit</Link>
    }
  >
    <SummaryTable.Row>{businessDetails.sector || 'Not set'}</SummaryTable.Row>
  </SummaryTable>
)

SectionSector.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionSector
