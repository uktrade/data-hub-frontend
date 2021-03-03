import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { YELLOW } from 'govuk-colours'

// TODO: Once we know what colours to use remove this
const COLOURS = ['#1D70B8', '#28A197', '#0D703D', '#85994C', '#FDDD01']

const Key = styled('ul')`
  list-style: none;
  margin: 0 0 ${SPACING.SCALE_4} 0;
  padding: ${SPACING.SCALE_2} 0;
`

const ListItem = styled('li')`
  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: ${SPACING.SCALE_2};
    background-color: ${(props) => props.color};
  }
`

const BarContainer = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: row;
  a {
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }
  &:hover a {
    opacity: 0.5;
    color: inherit;
  }
  > a:hover {
    opacity: 1;
    border: 2px solid ${YELLOW};
  }
`

const MakeBar = styled('a')`
  color: inherit;
  text-decoration: none;
  display: inline-block;
  width: ${(props) => props.percent}%;
  padding: ${SPACING.SCALE_2};
  background-color: ${(props) => props.color};
  text-align: center;
`

const BarChart = ({ data, total, description }) => (
  <>
    <Key>
      {data.map(({ id, label }, i) => (
        <ListItem color={COLOURS[i]} key={id}>
          {label}
        </ListItem>
      ))}
    </Key>
    <p>{description}</p>
    <BarContainer>
      {data.map(({ id, label, value, link }, i) => (
        <MakeBar
          key={id}
          percent={(value / total) * 100}
          color={COLOURS[i]}
          href={link}
          title={`View ${label}`}
        >
          {value}
        </MakeBar>
      ))}
    </BarContainer>
  </>
)

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
}

export default BarChart
