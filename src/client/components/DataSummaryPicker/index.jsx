import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get } from 'lodash'
import { BODY_SIZES, SPACING } from '@govuk-react/constants'

import Select from '../../../client/components/Select'
import DataSummary from './DataSummary'

const StyledSelect = styled(Select)`
  font-size: ${BODY_SIZES.XSMALL}px;
  margin-bottom: ${SPACING.SCALE_5};
  span {
    font-size: ${BODY_SIZES.SMALL}px;
  }
  select {
    font-size: ${BODY_SIZES.SMALL}px;
  }
`

const DataSummaryPicker = ({ dataRanges, ...props }) => {
  const defaultRangeName = dataRanges[0]?.name
  const [selectedRangeName, setSelectedRangeName] = useState(defaultRangeName)
  const [selectedDataRange] = dataRanges.filter(
    ({ name }) => name === selectedRangeName
  )
  const data = get(selectedDataRange, 'range', [])

  return (
    <DataSummary data={data} {...props}>
      <StyledSelect
        name="sortBy"
        label="Date range"
        input={{ onChange: (e) => setSelectedRangeName(e.target.value) }}
      >
        {dataRanges.map(({ label, name }) => (
          <option value={name} key={name}>
            {label}
          </option>
        ))}
      </StyledSelect>
    </DataSummary>
  )
}

DataSummaryPicker.propTypes = {
  title: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  dataRanges: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      range: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
          link: PropTypes.string,
        })
      ).isRequired,
    })
  ),
}

export default DataSummaryPicker
