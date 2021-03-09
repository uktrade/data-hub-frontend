import React from 'react'
import PropTypes from 'prop-types'

const OutstandingPropositions = ({ outstandingPropositions = [] }) => (
  <ul>
    {outstandingPropositions.map(({ id, investment_project, deadline }) => (
      <li key={id}>
        {investment_project.name}
        {investment_project.project_code}
        {deadline}
      </li>
    ))}
  </ul>
)

OutstandingPropositions.propTypes = {
  outstandingPropositions: PropTypes.arrayOf(
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
}

export default OutstandingPropositions
