import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { SummaryTable } from '../../../../../client/components/'

const SectionRegion = ({ company, isArchived, urls }) =>
  !!company.ukBased ? (
    <SummaryTable
      caption="DBT region"
      data-test="regionDetailsContainer"
      actions={
        !isArchived && <Link href={`${urls.companyEdit}#uk_region`}>Edit</Link>
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
  urls: PropTypes.object.isRequired,
}

export default SectionRegion
