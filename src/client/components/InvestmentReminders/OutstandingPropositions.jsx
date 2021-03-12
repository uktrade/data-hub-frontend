import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'

import { H3 } from '@govuk-react/heading'
import { LINK_COLOUR, RED, TEXT } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import { getDifferenceInDays } from '../../utils/date-utils'

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

const StyledDueDate = styled('span')`
  margin-top: ${SPACING.SCALE_1};
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${TEXT};
`

const StyledDueCountdown = styled('span')`
  margin-top: ${SPACING.SCALE_1};
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
  margin-bottom: ${SPACING.SCALE_3};
`

const StyledDeadline = styled('div')`
  display: flex;
  justify-content: space-between;
`

const OutstandingPropositions = ({ outstandingPropositions = {} }) => {
  const { results = [], count = 0 } = outstandingPropositions
  return (
    <div data-test="outstanding-propositions">
      <StyledSubHeading>Outstanding propositions ({count})</StyledSubHeading>
      <StyledList data-test="outstanding-propositions-list">
        {results.map(({ id, investment_project, deadline }) => (
          <StyledListItem key={id}>
            <StyledProjectLink
              href={urls.investments.projects.proposition(
                investment_project.id,
                id
              )}
            >
              {investment_project.project_code}
            </StyledProjectLink>
            <StyledDeadline>
              <StyledDueDate data-test="outstanding-proposition-deadline">
                Due {format(deadline, 'ddd, DD MMM YYYY')}
              </StyledDueDate>
              <StyledDueCountdown data-test="outstanding-proposition-countdown">
                {getDifferenceInDays(deadline)}
              </StyledDueCountdown>
            </StyledDeadline>
          </StyledListItem>
        ))}
      </StyledList>
    </div>
  )
}

OutstandingPropositions.propTypes = {
  outstandingPropositions: PropTypes.shape({
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
    ),
  }),
}

export default OutstandingPropositions
