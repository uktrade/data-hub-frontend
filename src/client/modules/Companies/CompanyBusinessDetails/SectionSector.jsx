import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'

const SectionSector = ({ company, isArchived }) => (
  <SummaryTable
    caption="DBT sector"
    data-test="sectorDetailsContainer"
    actions={
      !isArchived && (
        <Link
          href={`${urls.companies.edit(company.id)}#sector`}
          key={company.id}
        >
          Edit
        </Link>
      )
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
}

export default SectionSector
