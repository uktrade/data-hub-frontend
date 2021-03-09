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
import { FONT_WEIGHTS } from '@govuk-react/constants'
import { ResponsivePie } from '@nivo/pie'

const segmentColours = [BLUE, TURQUOISE, GREEN, YELLOW, GRASS_GREEN]

const CentredMetric = ({ dataWithArc, centerX, centerY }) => {
  let total = 0
  dataWithArc.forEach((datum) => {
    total += datum.value
  })
  const customY1 = centerY - 30
  const customY2 = centerY + 20
  return (
    <>
      <text
        x={centerX}
        y={customY1}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '80px',
          fontWeight: FONT_WEIGHTS.bold,
        }}
      >
        {total}
      </text>
      <text
        x={centerX}
        y={customY2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '20px',
          fontWeight: FONT_WEIGHTS.bold,
        }}
      >
        {'Projects'}
      </text>
    </>
  )
}

const PieChart = ({ data, height }) => (
  <div style={{ height }}>
    <ResponsivePie
      theme={{
        fontSize: '16px',
      }}
      data={data}
      colors={segmentColours}
      margin={{ top: 30, right: 70, bottom: 150, left: 0 }}
      startAngle={-90}
      innerRadius={0.75}
      borderWidth={1}
      borderColor="transparent"
      radialLabelsSkipAngle={10}
      radialLabel={(d) => d.value}
      radialLabelsLinkColor={GREY_2}
      radialLabelsTextColor={GREY_2}
      radialLabelsLinkStrokeWidth={3}
      enableSliceLabels={false}
      layers={['slices', 'radialLabels', CentredMetric, 'legends']}
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          translateY: 150,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          itemsSpacing: 5,
          symbolSize: 18,
          symbolShape: 'square',
        },
      ]}
    />
  </div>
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
