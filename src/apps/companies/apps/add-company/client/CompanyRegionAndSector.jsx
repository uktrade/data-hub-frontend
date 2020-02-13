/* eslint-disable camelcase */

import React from 'react'
import PropTypes from 'prop-types'
import { Step, FieldSelect } from 'data-hub-components'

function CompanyRegionAndSector({ regions, sectors, isUK }) {
  return (
    <Step name="companyRegionAndSector" forwardButton="Add company">
      {isUK && (
        <FieldSelect
          name="uk_region"
          label="DIT region"
          emptyOption="-- Select DIT region --"
          options={regions}
          required="Select DIT region"
        />
      )}

      <FieldSelect
        name="sector"
        label="DIT sector"
        emptyOption="-- Select DIT sector --"
        options={sectors}
        required="Select DIT sector"
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

export default CompanyRegionAndSector
