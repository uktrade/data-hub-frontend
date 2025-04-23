import React from 'react'
import PropTypes from 'prop-types'

import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const SectionRegion = ({ company, isArchived }) =>
  !!company.ukBased ? (
    <SummaryTable
      caption="DBT region"
      data-test="regionDetailsContainer"
      actions={
        !isArchived && (
          <AccessibleLink
            href={`${urls.companies.edit(company.id)}#uk_region`}
            key={company.id}
          >
            Edit
          </AccessibleLink>
        )
      }
    >
      <SummaryTable.Row>
        {company.ukRegion ? company.ukRegion.name : 'Not set'}
      </SummaryTable.Row>
    </SummaryTable>
  ) : null

SectionRegion.propTypes = {
  company: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
}

export default SectionRegion
