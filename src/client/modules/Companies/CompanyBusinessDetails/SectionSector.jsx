import React from 'react'
import PropTypes from 'prop-types'

import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const SectionSector = ({ company, isArchived }) => (
  <SummaryTable
    caption="DBT sector"
    data-test="sectorDetailsContainer"
    actions={
      !isArchived && (
        <AccessibleLink
          href={`${urls.companies.edit(company.id)}#sector`}
          key={company.id}
        >
          Edit
        </AccessibleLink>
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
