import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { WHITE, GREY_3 } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'
import { get } from 'lodash'

import { DARK_BLUE } from '../../utils/colors'

const TimelineContainer = styled('div')({
  backgroundColor: ({ theme }) =>
    get(theme, 'container.backgroundColor', GREY_3),
  padding: SPACING.SCALE_2,
  [MEDIA_QUERIES.LARGESCREEN]: {
    padding: ({ theme }) =>
      get(theme, 'container.largeScreen.padding', SPACING.SCALE_5),
  },
})

const StyledOl = styled('ol')({
  fontSize: FONT_SIZE.SIZE_14,
  listStyleType: 'none',
  boxSizing: 'border-box',
  padding: `0 0 0 ${SPACING.SCALE_3}`,
  [MEDIA_QUERIES.LARGESCREEN]: {
    padding: `0 ${SPACING.SCALE_3}`,
    margin: 0,
    display: 'table',
    width: '100%',
  },
})

const StyledLi = styled('li')({
  borderLeft: `2px solid ${DARK_BLUE}`,
  padding: `0 0 ${SPACING.SCALE_4} 0`,
  position: 'relative',
  '&:last-child': {
    padding: 0,
    '&::before': {
      top: '2px',
    },
  },
  '&::before': {
    position: 'absolute',
    display: 'block',
    content: '""',
    borderRadius: '50%',
    left: ({ theme }) => get(theme, 'li.before.left', '-12px'),
    width: ({ theme }) => get(theme, 'li.before.width', SPACING.SCALE_4),
    height: ({ theme }) => get(theme, 'li.before.height', SPACING.SCALE_4),
    backgroundColor: ({ isStageComplete }) =>
      isStageComplete ? `${DARK_BLUE}` : `${WHITE}`,
    border: ({ theme, isStageComplete }) => {
      const border = get(theme, 'li.before.border')
      return border
        ? isStageComplete
          ? `2px solid ${DARK_BLUE}`
          : border
        : `2px solid ${DARK_BLUE}`
    },
  },
  span: {
    display: ({ theme }) => get(theme, 'li.span.display', 'block'),
    padding: `2px 0 4px ${SPACING.SCALE_4}`,
  },
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'table-cell',
    width: '25%',
    padding: ({ theme }) =>
      get(theme, 'li.mqLargeScreen.padding', `${SPACING.SCALE_4} 0 0 0`),
    borderTop: ({ theme, isLinkActive }) => {
      const borderTop = get(theme, 'li.mqLargeScreen.borderTop')
      if (borderTop) {
        return isLinkActive ? `2px solid ${DARK_BLUE}` : borderTop
      }
      return `3px solid ${DARK_BLUE}`
    },
    borderLeft: 'none',
    '&:last-child': {
      padding: `${SPACING.SCALE_4} 0 0 0`,
      borderColor: 'transparent',
      '&::before': {
        top: ({ theme }) => get(theme, 'li.mqLargeScreen.before.top', '-12px'),
      },
    },
    '&::before': {
      top: ({ theme }) => get(theme, 'li.mqLargeScreen.before.top', '-12px'),
      left: ({ theme }) => get(theme, 'li.mqLargeScreen.before.left', '-12px'),
    },
    span: {
      padding: 0,
      position: 'absolute',
      width: '100px',
      textAlign: 'center',
      left: '-50px',
    },
  },
})

const Timeline = ({ stages, currentStage = '', ...props }) => {
  const stageIndex = stages.indexOf(currentStage)
  return (
    <TimelineContainer data-test="timeline" {...props}>
      <StyledOl>
        {stages.map((stage, i) => {
          const isStageComplete = i <= stageIndex
          const isLinkActive = i < stageIndex
          return (
            <StyledLi
              key={i}
              isLinkActive={isLinkActive}
              isStageComplete={isStageComplete}
              aria-label={
                isStageComplete ? 'stage complete' : 'stage incomplete'
              }
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
