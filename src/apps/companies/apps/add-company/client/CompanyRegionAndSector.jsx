import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Step, FieldSelect } from '../../../../../client/components'
import { mapPostcodeToRegion } from './transformer'

function CompanyRegionAndSector({ regions, sectors, isUK, postcode }) {
  return (
    <Step name="companyRegionAndSector" forwardButton="Add company">
      {isUK && (
        <FieldSelect
          name="uk_region"
          label="DBT region"
          initialValue={mapPostcodeToRegion(postcode)}
          emptyOption="-- Select DBT region --"
          options={regions}
          required="Select DBT region"
        />
      )}
      <FieldSelect
        name="sector"
        label="DBT sector"
        emptyOption="-- Select DBT sector --"
        options={sectors}
        required="Select DBT sector"
      />
    </Step>
  )
}

CompanyRegionAndSector.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  isUK: PropTypes.bool.isRequired,
}

export default connect(
  ({ addCompany }, { regions, sectors, isUK, postcode }) => {
    const { region } = addCompany
    return {
      regions,
      region,
      sectors,
      isUK,
      postcode,
    }
  }
)(CompanyRegionAndSector)
