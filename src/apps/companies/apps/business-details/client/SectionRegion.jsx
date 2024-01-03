import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from '../../../../../client/components/'
import urls from '../../../../../lib/urls'

const SectionRegion = ({ company, isArchived }) =>
  !!company.ukBased ? (
    <SummaryTable
      caption="DBT region"
      data-test="regionDetailsContainer"
      actions={
        !isArchived && (
          <Link
            href={`${urls.companies.edit(company.id)}#uk_region`}
            key={company.id}
          >
            Edit
          </Link>
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
