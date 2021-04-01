import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'

import { H3 } from '@govuk-react/heading'
import { LINK_COLOUR, RED, TEXT, GREY_1 } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import { getDifferenceInDaysLabel } from '../../utils/date-utils'

const StyledSubHeading = styled(H3)`
  color: ${RED};
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: ${FONT_WEIGHTS.regular};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledProjectLink = styled('a')`
  display: block;
  font-size: ${FONT_SIZE.SIZE_19};
  color: ${LINK_COLOUR};
`

const StyledProjectCode = styled('div')`
  margin: ${SPACING.SCALE_2} 0;
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${GREY_1};
`

const StyledDueDate = styled('span')`
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${TEXT};
`

const StyledDueCountdown = styled('span')`
  text-align: right;
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${TEXT};
`

const StyledList = styled('ul')`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const StyledListItem = styled('li')`
  margin-bottom: ${SPACING.SCALE_4};
`

const StyledDeadline = styled('div')`
  display: flex;
  justify-content: space-between;
`

const OutstandingPropositions = ({ results, count }) => {
  return (
    <div data-test="outstanding-propositions">
      <StyledSubHeading>Outstanding propositions ({count})</StyledSubHeading>
      <StyledList data-test="outstanding-propositions-list">
        {results.map(({ id, investment_project, name, deadline }) => (
          <StyledListItem key={id}>
            <StyledProjectLink
              href={urls.investments.projects.propositions(
                investment_project.id
              )}
            >
              {name}
            </StyledProjectLink>
            <StyledProjectCode data-test="outstanding-proposition-project-code">
              {investment_project.project_code}
            </StyledProjectCode>
            <StyledDeadline>
              <StyledDueDate data-test="outstanding-proposition-deadline">
                Due {format(new Date(deadline), 'dd MMM yyyy')}
              </StyledDueDate>
              <StyledDueCountdown data-test="outstanding-proposition-countdown">
                {getDifferenceInDaysLabel(deadline)}
              </StyledDueCountdown>
            </StyledDeadline>
          </StyledListItem>
        ))}
      </StyledList>
    </div>
  )
}

OutstandingPropositions.propTypes = {
  count: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      investment_project: PropTypes.shape({
        id: PropTypes.string.is_required,
        name: PropTypes.string.isRequired,
        project_code: PropTypes.string.isRequired,
      }),
      deadline: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      adviser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
}

export default OutstandingPropositions
