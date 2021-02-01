import React from 'react'
import PropTypes from 'prop-types'

const UserDetails = ({ name, last_login, dit_team }) => (
  <div>
    <div>{name}</div>
    <div>{last_login}</div>
    <pre>{dit_team.name}</pre>
    <pre>{dit_team.country.name}</pre>
  </div>
)

UserDetails.propTypes = {
  name: PropTypes.string.isRequired,
  last_login: PropTypes.string.isRequired,
  dit_team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    country: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }),
}

export default UserDetails
