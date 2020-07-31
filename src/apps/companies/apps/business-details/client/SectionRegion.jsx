import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from '../../../../../client/components/'

const SectionRegion = ({ businessDetails, isArchived, isBasedInUK, urls }) =>
  isBasedInUK ? (
    <SummaryTable
      caption="DIT region"
      data-auto-id="regionDetailsContainer"
      actions={
        !isArchived && <Link href={`${urls.companyEdit}#uk_region`}>Edit</Link>
      }
    >
      <SummaryTable.Row>
        {businessDetails.uk_region || 'Not set'}
      </SummaryTable.Row>
    </SummaryTable>
  ) : null

SectionRegion.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isBasedInUK: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionRegion
