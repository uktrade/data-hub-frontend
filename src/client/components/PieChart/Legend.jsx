import React from 'react'
import PropTypes from 'prop-types'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import AccessibleLink from '../Link'

const StyledLegend = styled('figcaption')({})
const StyledList = styled('ul')({
  listStyle: 'none',
  paddingLeft: SPACING.SCALE_2,
})
const StyledListItem = styled('li')(({ colour }) => ({
  margin: `${SPACING.SCALE_2} 0`,
  position: 'relative',
  textIndent: '1.8em',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: colour,
    width: '1.2em',
    height: '1.2em',
  },
}))

const Legend = ({ data }) => (
  <StyledLegend data-test="pie-chart-legend">
    <StyledList>
      {data.map(({ id, name, value, link, colour }) => (
        <StyledListItem
          key={name}
          colour={colour}
          data-test={`pie-chart-legend-${name}`}
        >
          {value ? <AccessibleLink href={link}>{id}</AccessibleLink> : id} (
          {value})
        </StyledListItem>
      ))}
    </StyledList>
  </StyledLegend>
)

Legend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
      colour: PropTypes.string,
    })
  ).isRequired,
}

export default Legend
