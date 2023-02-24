import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import React from 'react'

const AdviserActivityRenderer = ({
  adviser: { name, emailAddress, team },
  isOverview,
}) => {
  const emailLink = <Link href={`mailto:${emailAddress}`}> {emailAddress}</Link>
  const teamString = team ? `${team} ` : null
  return !isOverview ? (
    <>
      <span>{name}</span> {emailLink}, {teamString} <br />
    </>
  ) : (
    <>{name}</>
  )
}

AdviserActivityRenderer.propTypes = {
  adviser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    team: PropTypes.string, // Only available for Interactions
  }).isRequired,
}

export default AdviserActivityRenderer
