import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { BLUE } from 'govuk-colours'
import styled from 'styled-components'

const StyledActivitySubject = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

const StyledActivitySubjectSquash = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-bottom: 0;
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
  url,
  linkDataTest,
  isOverview,
  dataTest = 'activity-card-subject',
}) => {
  return isOverview ? (
    <StyledActivitySubject data-test={dataTest}>
      {children}
    </StyledActivitySubject>
  ) : (
    <StyledActivitySubjectSquash data-test={dataTest}>
      <Link dataTest={linkDataTest} href={url}>
        {children}
      </Link>
    </StyledActivitySubjectSquash>
  )
}

ActivityCardSubject.propTypes = {
  children: PropTypes.node.isRequired,
}
ActivityCardSubject.defaultProps = {
  isOverview: false,
}

export default ActivityCardSubject
