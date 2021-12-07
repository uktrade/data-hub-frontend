import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import { SummaryTable } from '../../../../../client/components/'
import DynamicFields from '../../../../../client/components/DynamicFields'

const SectionAbout = ({ businessDetails, isArchived, urls }) => (
  <SummaryTable
    caption={`About ${businessDetails.name}`}
    data-test="aboutDetailsContainer"
    actions={!isArchived && <Link href={urls.companyEdit}>Edit</Link>}
  >
    <DynamicFields items={businessDetails.about} />
  </SummaryTable>
)

SectionAbout.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionAbout
