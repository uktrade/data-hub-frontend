import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H3 } from '@govuk-react/heading'
import { RED } from 'govuk-colours'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import { format } from 'date-fns'

import urls from '../../../lib/urls'
import { getDifferenceInDays } from '../../utils/date-utils'

const RemindersHeading = styled(H3)`
  color: ${RED};
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: normal;
  padding-top: ${SPACING.SCALE_2};
`

const StyledProjectLink = styled('a')`
  display: block;
  flex: 1 0 100%;
`

const StyledDueDate = styled('span')`
  margin-top: ${SPACING.SCALE_1};
`

const StyledDueCountdown = styled('span')`
  margin-top: ${SPACING.SCALE_1};
  text-align: right;
`

const StyledList = styled('ul')``

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
    <>
      <RemindersHeading>Outstanding propositions ({count})</RemindersHeading>
      <StyledList>
        {results.map(({ id, investment_project, deadline }) => (
          <StyledListItem key={id}>
            <StyledProjectLink href={urls.investments.projects.details(id)}>
              {investment_project.project_code}
            </StyledProjectLink>
            <StyledDeadline>
              <StyledDueDate>
                Due {format(deadline, 'ddd, DD MMM YYYY')}
              </StyledDueDate>
              <StyledDueCountdown>
                {getDifferenceInDays(deadline)}
              </StyledDueCountdown>
            </StyledDeadline>
          </StyledListItem>
        ))}
      </StyledList>
    </>
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
