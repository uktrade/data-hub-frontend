import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import styled from 'styled-components'

import { BLUE } from '../../../../../client/utils/colours'

const StyledActivitySubject = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: ${({ margin }) => `${margin.top}px`};
  margin-bottom: ${({ margin }) => `${margin.bottom}px`};
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

const ActivityCardSubject = ({
  children,
  dataTest = 'activity-card-subject',
  margin = { bottom: 10 },
}) => (
  <StyledActivitySubject data-test={dataTest} margin={margin}>
    {children}
  </StyledActivitySubject>
)

ActivityCardSubject.propTypes = {
  children: PropTypes.node.isRequired,
  dataTest: PropTypes.string,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
  }),
}

export default ActivityCardSubject
