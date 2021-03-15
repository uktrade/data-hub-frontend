import React from 'react'
import PropTypes from 'prop-types'

import OutstandingPropositions from './OutstandingPropositions'

const InvestmentReminders = ({ outstandingPropositions }) => (
  <div data-test="investment-reminders">
    <OutstandingPropositions {...outstandingPropositions} />
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
    ).isRequired,
  }),
}

export default InvestmentReminders
