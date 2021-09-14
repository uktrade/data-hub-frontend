import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

const StyledLegend = styled('figcaption')({})
const StyledList = styled('ul')({})
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
      {data.map(({ id, label, value, link, colour }) => (
        <StyledListItem key={id} colour={colour}>
          {value ? <Link href={link}>{label}</Link> : label}
        </StyledListItem>
      ))}
    </StyledList>
  </StyledLegend>
)

Legend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
      colour: PropTypes.string,
    })
  ).isRequired,
}

export default Legend
