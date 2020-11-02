import React from 'react'
import { Chip } from '../../components'

const AdviserFilterChips = ({ selectedAdvisers }) => {
  const advisers = selectedAdvisers.map(({ advisers }) => advisers)
  return (
    <>
      {advisers.map(({ name, id }) => (
        <Chip label={name} key={id} />
      ))}
    </>
  )
}

export default AdviserFilterChips
