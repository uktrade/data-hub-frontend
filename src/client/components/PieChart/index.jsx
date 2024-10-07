import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { ResponsivePie } from '@nivo/pie'
import styled from 'styled-components'
import pluralize from 'pluralize'

import Legend from './Legend'
import { MID_GREY } from '../../utils/colours'

const StyledFigure = styled('figure')({
  border: `1px solid ${MID_GREY}`,
})

const StyledPieContainer = styled('div')(({ height }) => ({
  paddingTop: SPACING.SCALE_3,
  height: `${height}px`,
}))

const centredText = (text, fontSize, x, y) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    dominantBaseline="central"
    style={{
      fontSize: `${fontSize}px`,
      fontWeight: FONT_WEIGHTS.bold,
    }}
  >
    {text}
  </text>
)

const PieChart = ({ data, unit = '', height }) => {
  const pieWrapperRef = useRef(null)
  const [total, setState] = useState(false)
  // Nivo currently doesn't support aria labels as props
  // https://github.com/plouc/nivo/issues/126
  // This is our workaround until/if nivo updates its accessibility
  useEffect(() => {
    const pieWrapper = pieWrapperRef.current
    const svgWrapper = pieWrapper.children[0].children[0]
    if (svgWrapper) {
      svgWrapper.children[0].setAttribute(
        'aria-label',
        `${total} ${pluralize(unit, total)}`
      )
    }
  })
  const CentredProjectTotal = ({ dataWithArc, centerX, centerY }) => {
    setState(
      dataWithArc.reduce((accumulator, datum) => accumulator + datum.value, 0)
    )
    return (
      <>
        {centredText(total, 60, centerX, centerY - 20)}
        {centredText(pluralize(unit, total), 20, centerX, centerY + 30)}
      </>
    )
  }
  return (
    <StyledFigure>
      <StyledPieContainer
        ref={pieWrapperRef}
        height={height}
        data-test="pie-chart"
      >
        <ResponsivePie
          theme={{
            fontSize: '16px',
          }}
          data={data}
          colors={(item) => item.data.colour}
          margin={{ top: 20, bottom: 20 }}
          startAngle={-90}
          innerRadius={0.75}
          padAngle={0}
          enableArcLabels={false}
          isInteractive={false}
          layers={['arcs', CentredProjectTotal]}
        />
      </StyledPieContainer>
      <Legend data={data} />
    </StyledFigure>
  )
}

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  height: PropTypes.number,
  unit: PropTypes.string,
}

export default PieChart
