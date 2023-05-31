import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from '../../../../../client/components/'

const SectionSector = ({ company, isArchived, urls }) => (
  <SummaryTable
    caption="DBT sector"
    data-test="sectorDetailsContainer"
    actions={
      !isArchived && <Link href={`${urls.companyEdit}#sector`}>Edit</Link>
    }
  >
    <SummaryTable.Row>
      {company.sector ? company.sector.name : 'Not set'}
    </SummaryTable.Row>
  </SummaryTable>
)

SectionSector.propTypes = {
  company: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionSector
