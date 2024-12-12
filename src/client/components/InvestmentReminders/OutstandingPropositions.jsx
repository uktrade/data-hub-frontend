import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H3 } from '@govuk-react/heading'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import { DARK_GREY, LINK_COLOUR, RED, TEXT_COLOUR } from '../../utils/colours'
import { formatDate, DATE_FORMAT_FULL_DAY } from '../../utils/date-utils'
import { getDifferenceInDaysLabel } from '../../utils/date'
import urls from '../../../lib/urls'

const StyledSubHeading = styled(H3)`
  color: ${RED};
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: ${FONT_WEIGHTS.regular};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledSubHeadingEmpty = styled(StyledSubHeading)`
  color: ${DARK_GREY};
  margin: 0;
`

const StyledProjectLink = styled('a')`
  display: block;
  font-size: ${FONT_SIZE.SIZE_19};
  color: ${LINK_COLOUR};
`

const StyledProjectCode = styled('div')`
  margin: ${SPACING.SCALE_1} 0;
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${DARK_GREY};
`

const StyledDueDate = styled('span')`
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${TEXT_COLOUR};
`

const StyledDueCountdown = styled('span')`
  margin-top: ${SPACING.SCALE_1};
  text-align: right;
  white-space: nowrap;
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${TEXT_COLOUR};
`

const StyledList = styled('ul')`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const StyledListItem = styled('li')`
  margin-bottom: ${SPACING.SCALE_4};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
`

const StyledDetails = styled('div')`
  padding-right: ${SPACING.SCALE_3};
`

const OutstandingPropositions = ({ results, count }) => (
  <>
    {!!results.length ? (
      <div data-test="outstanding-propositions">
        <StyledSubHeading data-test="outstanding-propositions-heading">
          Outstanding propositions ({count})
        </StyledSubHeading>
        <StyledList data-test="outstanding-propositions-list">
          {results.map(({ id, investment_project, name, deadline }) => (
            <StyledListItem key={id}>
              <StyledDetails>
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
                <StyledDueDate data-test="outstanding-proposition-deadline">
                  Due {formatDate(new Date(deadline), DATE_FORMAT_FULL_DAY)}
                </StyledDueDate>
              </StyledDetails>
              <StyledDueCountdown data-test="outstanding-proposition-countdown">
                {getDifferenceInDaysLabel(deadline)}
              </StyledDueCountdown>
            </StyledListItem>
          ))}
        </StyledList>
      </div>
    ) : (
      <StyledSubHeadingEmpty data-test="outstanding-propositions-empty">
        Projects with propositions due will be displayed here.
      </StyledSubHeadingEmpty>
    )}
  </>
)

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
