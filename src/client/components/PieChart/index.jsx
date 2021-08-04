import React from 'react'
import PropTypes from 'prop-types'
import {
  BLUE,
  YELLOW,
  GREEN,
  TURQUOISE,
  GRASS_GREEN,
  GREY_2,
} from 'govuk-colours'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { ResponsivePie } from '@nivo/pie'
import styled from 'styled-components'

const segmentColours = [BLUE, TURQUOISE, GREEN, GRASS_GREEN, YELLOW]

const StyledPieContainer = styled('div')`
  padding-top: ${SPACING.SCALE_3};
  ${({ height }) => `height: ${height}px`}
`

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

const CentredProjectTotal = ({ dataWithArc, centerX, centerY }) => {
  const total = dataWithArc.reduce(
    (accumulator, datum) => accumulator + datum.value,
    0
  )

  return (
    <>
      {centredText(total, 60, centerX, centerY - 20)}
      {centredText('Projects', 20, centerX, centerY + 30)}
    </>
  )
}

const PieChart = ({ data, height }) => (
  <StyledPieContainer height={height} data-test="pie-chart">
    <ResponsivePie
      theme={{
        fontSize: '16px',
      }}
      data={data}
      colors={segmentColours}
      margin={{ top: 20, bottom: 150, left: 50, right: 50 }}
      startAngle={-90}
      innerRadius={0.75}
      padAngle={0}
      enableArcLabels={false}
      arcLinkLabel="value"
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsOffset={3}
      arcLinkLabelsColor={GREY_2}
      arcLinkLabelsTextColor={GREY_2}
      arcLinkLabelsThickness={3}
      arcLinkLabelsDiagonalLength={9}
      arcLinkLabelsStraightLength={12}
      arcLinkLabelsTextOffset={2}
      isInteractive={false}
      layers={['arcs', 'arcLinkLabels', 'legends', CentredProjectTotal]}
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          translateX: -50,
          translateY: 150,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          itemsSpacing: 8,
          symbolSize: 18,
          symbolShape: 'square',
        },
      ]}
    />
  </StyledPieContainer>
)

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
}

export default PieChart
