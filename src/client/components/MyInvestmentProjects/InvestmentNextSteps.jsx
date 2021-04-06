import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { UnorderedList, ListItem } from 'govuk-react'

import { investments } from '../../../lib/urls'
import { INCOMPLETE_FIELDS } from './constants'
import { rgba, FOCUS_COLOUR } from '../../utils/colors'

const StyledDiv = styled('div')`
  height: 100%;
  /* Colour is in the Gov uk design system but not in our govuk-colors dependancy */
  background-color: ${rgba(FOCUS_COLOUR, 0.2)};
  padding: 9px ${SPACING.SCALE_2} 8px ${SPACING.SCALE_2};
`

const StyledHeader = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 0;
`

const StyledList = styled(UnorderedList)`
  margin-bottom: 0;
`

const StyledListItem = styled(ListItem)`
  font-size: ${FONT_SIZE.SIZE_16};
  /* I can't see any other way to override this margin */
  margin-bottom: 0 !important;
  &::marker {
    font-size: 22px;
    line-height: 1;
  }
`

const OverflowWrapper = styled('span')`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: calc(100% - 8px);
`

const StyledLink = styled('a')`
  font-size: ${FONT_SIZE.SIZE_16};
`

const InvestmentNextSteps = ({ nextSteps, nextStage, projectId }) => {
  const stepsToComplete = Object.entries(INCOMPLETE_FIELDS)
    .reduce(
      (newObj, [key, value]) =>
        nextSteps
          ? nextSteps.includes(key)
            ? [...newObj, value]
            : newObj
          : newObj,
      []
    )
    .sort()

  const totalSteps = stepsToComplete.length
  const hasStepsToComplete = !!totalSteps
  const additionalSteps = totalSteps >= 3 ? totalSteps - 3 : 0
  const hasAdditonalSteps = !!additionalSteps

  return (
    <StyledDiv data-test="investment-steps">
      <StyledHeader>Next step{totalSteps > 1 && 's'}</StyledHeader>
      {hasStepsToComplete && (
        <>
          <StyledList listStyleType="bullet">
            {stepsToComplete.map(
              (step, i) =>
                i <= 2 && (
                  <StyledListItem key={i}>
                    <OverflowWrapper>{step}</OverflowWrapper>
                  </StyledListItem>
                )
            )}
            {hasAdditonalSteps && (
              <StyledListItem>
                Plus {additionalSteps} additional field
                {additionalSteps > 1 && 's'}
              </StyledListItem>
            )}
          </StyledList>
          <StyledLink href={investments.projects.details(projectId)}>
            Add details to move to {nextStage} stage
          </StyledLink>
        </>
      )}
    </StyledDiv>
  )
}

InvestmentNextSteps.propTypes = {
  nextSteps: PropTypes.arrayOf(PropTypes.string),
  nextStage: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
}

export default InvestmentNextSteps
