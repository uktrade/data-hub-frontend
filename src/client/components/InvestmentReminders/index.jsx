import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import NotificationBadge from '../NotificationBadge'

import OutstandingPropositions from './OutstandingPropositions'

const StyledHeading = styled(H2)`
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: ${FONT_WEIGHTS.bold};
  margin: 0;
`

const InvestmentReminders = ({ outstandingPropositions }) => (
  <div data-test="investment-reminders">
    <StyledHeading data-test="investment-reminders-heading">
      Reminders{' '}
      <NotificationBadge
        label={outstandingPropositions && outstandingPropositions.count}
      />
    </StyledHeading>
    <OutstandingPropositions
      outstandingPropositions={outstandingPropositions}
    />
  </div>
)

InvestmentReminders.propTypes = {
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

export default InvestmentReminders
