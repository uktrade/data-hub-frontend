import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING, FONT_WEIGHTS } from '@govuk-react/constants'

import PieChart from '../PieChart'

const StyledContainer = styled('div')`
  padding-top: ${SPACING.SCALE_1};
`

const StyledHeader = styled('h3')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const DataSummary = ({ title, data = [], children }) => {
  const chartData = data.map(({ label, value }) => ({
    id: label,
    label: `${label} (${value})`,
    value,
  }))

  return (
    <StyledContainer>
      {title && <StyledHeader>{title}</StyledHeader>}
      {children}
      <PieChart data={chartData} height={420} />
    </StyledContainer>
  )
}

DataSummary.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  children: PropTypes.node,
}

export default DataSummary
