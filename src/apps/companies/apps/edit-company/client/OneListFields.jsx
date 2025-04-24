import React from 'react'
import PropTypes from 'prop-types'
import Details from '@govuk-react/details'

import { FieldUneditable } from '../../../../../client/components'
import AccessibleLink from '../../../../../client/components/Link'

function OneListFields({ company, sectors, headquarterTypes, oneListEmail }) {
  const sectorName = sectors.find(
    (s) => company.sector && company.sector.id === s.value
  )
  const headquarterType = headquarterTypes.find(
    (s) => company.headquarter_type && company.headquarter_type.id === s.value
  )

  return (
    <>
      <FieldUneditable name="sector" label="Sector">
        {sectorName?.label || 'Not set'}
      </FieldUneditable>

      <Details summary="Need to edit the sector?" data-test="sector-details">
        If you need to change the sector for a company on the One List, please
        email{' '}
        <AccessibleLink href={`mailto:${oneListEmail}`}>
          {oneListEmail}
        </AccessibleLink>
      </Details>

      <FieldUneditable name="headquarter_type" label="Business hierarchy">
        {headquarterType?.label || 'Not a headquarters'}
      </FieldUneditable>

      <Details
        summary="Need to edit the headquarter type?"
        data-test="headquarter_type-details"
      >
        If you need to change the headquarter type for a company on the One
        List, please email{' '}
        <AccessibleLink href={`mailto:${oneListEmail}`}>
          {oneListEmail}
        </AccessibleLink>
      </Details>
    </>
  )
}

OneListFields.propTypes = {
  company: PropTypes.object.isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  headquarterTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  oneListEmail: PropTypes.string.isRequired,
}

export default OneListFields
