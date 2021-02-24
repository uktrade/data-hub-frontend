import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { get } from 'lodash'
import { BODY_SIZES, SPACING } from '@govuk-react/constants'

import Select from '../../../client/components/Select'
import Chart from './Chart'

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

const MultiRangeChart = ({ dataRanges, ...props }) => {
  let defaultRangeName = null
  if (dataRanges.length) {
    defaultRangeName = dataRanges[0].name
  }
  const [selectedRangeName, setSelectedRangeName] = useState(defaultRangeName)
  const [selectedDataRange] = dataRanges.filter(
    ({ name }) => name === selectedRangeName
  )
  props.data = get(selectedDataRange, 'range', [])

  return (
    <Chart {...props}>
      <StyledSelect
        name="sortBy"
        label="Date range"
        input={{ onChange: (e) => setSelectedRangeName(e.target.value) }}
      >
        {dataRanges.map(({ label, name }, i) => (
          <option value={name} key={i}>
            {label}
          </option>
        ))}
      </StyledSelect>
    </Chart>
  )
}

MultiRangeChart.propTypes = {
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
        })
      ).isRequired,
    })
  ),
  url: PropTypes.string.isRequired,
  queryParam: PropTypes.string.isRequired,
}

export default MultiRangeChart
