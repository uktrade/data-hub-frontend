import React from 'react'
import PropTypes from 'prop-types'
import { BLUE, YELLOW, GREEN, TURQUOISE, GRASS_GREEN } from 'govuk-colours'
import { ResponsivePie } from '@nivo/pie'

const segmentColours = [BLUE, TURQUOISE, GREEN, YELLOW, GRASS_GREEN]

const legends = [
  {
    anchor: 'bottom',
    direction: 'row',
    translateY: 56,
    itemWidth: 100,
    itemHeight: 18,
    itemTextColor: '#999',
    symbolSize: 18,
    symbolShape: 'circle',
    effects: [
      {
        on: 'hover',
        style: {
          itemTextColor: '#000',
        },
      },
    ],
  },
]

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  let total = 0
  dataWithArc.forEach((datum) => {
    total += datum.value
  })
  const customY1 = centerY - 20
  const customY2 = centerY + 20
  return (
    <>
      <text
        x={centerX}
        y={customY1}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '60px',
          fontWeight: '600',
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
          fontWeight: '600',
        }}
      >
        {'Projects'}
      </text>
    </>
  )
}

const transformDataIds = (data) => {
  data.forEach((stage) => {
    stage.id = stage.label
  })
  return data
}

const PieChart = ({ data }) => (
  <div style={{ height: 747 }}>
    <ResponsivePie
      data={transformDataIds(data)}
      colors={segmentColours}
      margin={{ top: 0, right: 120, bottom: 80, left: 120 }}
      startAngle={-90}
      innerRadius={0.8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      radialLabelsSkipAngle={10}
      radialLabel={(d) => `${d.id}: ${d.value}`}
      radialLabelsLinkStrokeWidth={3}
      enableSliceLabels={false}
      layers={['slices', 'radialLabels', legends, CenteredMetric]}
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
