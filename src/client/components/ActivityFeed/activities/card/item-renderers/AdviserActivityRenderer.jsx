import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import React from 'react'

const AdviserActivityRenderer = (item) => {
  const name = <span>{item.name}</span>
  const emailAddress = (
    <Link href={`mailto:${item.emailAddress}`}> {item.emailAddress}</Link>
  )
  const team = item.team ? `${item.team} ` : null

  return (
    <>
      {name} {emailAddress}, {team} <br />
    </>
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
