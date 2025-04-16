import React from 'react'
import styled from 'styled-components'
import pluralize from 'pluralize'

import Legend from './Legend'
import { MID_GREY } from '../../utils/colours'

const dataToGradient = ({ data, total }) => {
  const stops = data.reduce((a, { colour, value }, i) => {
    const percentage = value / total
    const from = a[i - 1]?.to ?? 0
    const to = from + percentage

    return [
      ...a,
      {
        to,
        stop: `${colour} ${from}turn ${to}turn`,
      },
    ]
  }, [])

  return `conic-gradient(from -90deg, ${stops.map((x) => x.stop).join(',')}) border-box`
}

const Root = styled.figure({
  border: `1px solid ${MID_GREY}`,
})

const Pie = styled.div({
  position: 'relative',
  // This must be a string because of a styled-components bug:
  // https://github.com/styled-components/styled-components/issues/3254#issuecomment-1265113393
  aspectRatio: '1',
  borderRadius: '50%',
  maskComposite: 'exclude',
  background: dataToGradient,
  maxWidth: 250,
  margin: '30px auto',
})

const Filling = styled.div({
  background: 'white',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  aspectRatio: '1 / 1',
  width: '75%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
})

const PieChart = ({ data, unit = '' }) => {
  const total = data.reduce((a, { value }) => a + value, 0)
  const pluralizedProject = pluralize(unit, total)
  return (
    <Root data-test="pie-chart" aria-label={`${total} ${pluralizedProject}`}>
      <Pie data={data} total={total}>
        <Filling>
          <div style={{ fontSize: '3em' }}>{total}</div>
          <div>{pluralizedProject}</div>
        </Filling>
      </Pie>
      <Legend data={data} total={total} />
    </Root>
  )
}

export default PieChart
