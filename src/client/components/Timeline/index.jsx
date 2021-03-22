import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLUE, WHITE, GREY_3 } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'

const TimelineContainer = styled('div')`
  background-color: ${GREY_3};
  padding: ${SPACING.SCALE_2};
  ${MEDIA_QUERIES.LARGESCREEN} {
    padding: ${SPACING.SCALE_5} ${SPACING.SCALE_3};
  }
  ${MEDIA_QUERIES.DESKTOP} {
    padding: ${SPACING.SCALE_5} ${SPACING.SCALE_4};
  }
`

const StyledOl = styled('ol')`
  font-size: ${FONT_SIZE.SIZE_14};
  list-style-type: none;
  box-sizing: border-box;
  padding: 0 0 0 ${SPACING.SCALE_4};
  ${MEDIA_QUERIES.LARGESCREEN} {
    padding: 0 ${SPACING.SCALE_4};
    margin: 0;
    display: table;
    width: 100%;
  }
`

const StyledLi = styled('li')`
  border-left: 2px solid ${BLUE};
  padding: 0 0 ${SPACING.SCALE_4} 0;
  position: relative;
  &:last-child {
    padding: 0;
  }
  &::before {
    display: block;
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${BLUE};
    background-color: ${({ isStageComplete }) =>
      isStageComplete ? BLUE : WHITE};
    position: absolute;
    left: -13px;
  }
  span {
    display: block;
    padding: 2px 0 4px ${SPACING.SCALE_4};
  }
  ${MEDIA_QUERIES.LARGESCREEN} {
    padding: ${SPACING.SCALE_4} 0 0 0;
    display: table-cell;
    width: 25%;
    border-top: 3px solid ${BLUE};
    border-left: none;
    &:last-child {
      padding: ${SPACING.SCALE_4} 0 0 0;
      border-color: transparent;
    }
    &::before {
      top: -12px;
    }
    span {
      padding: 0;
      position: absolute;
      width: 100px;
      text-align: center;
      left: -50px;
    }
  }
`

const Timeline = ({ stages, currentStage = '', ...props }) => {
  const lowerCaseStageNames = stages.map((name) => name.toLowerCase())
  const stageIndex = lowerCaseStageNames.indexOf(currentStage.toLowerCase())
  return (
    <TimelineContainer data-test="timeline" {...props}>
      <StyledOl>
        {stages.map((stage, i) => {
          const isComplete = i <= stageIndex
          return (
            <StyledLi
              key={i}
              isStageComplete={isComplete}
              aria-label={isComplete ? 'stage complete' : 'stage incomplete'}
            >
              <span>{stage}</span>
            </StyledLi>
          )
        })}
      </StyledOl>
    </TimelineContainer>
  )
}

Timeline.propTypes = {
  stages: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Timeline
