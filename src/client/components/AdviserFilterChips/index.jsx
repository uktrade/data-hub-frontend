import React from 'react'
import { Chip } from '../../components'

const AdviserFilterChips = ({ selectedAdvisers }) => {
  return (
    <>
      {selectedAdvisers.map(({ advisers: { name, id } }) => (
        <Chip key={id}>{name}</Chip>
      ))}
    </>
  )
}

export default AdviserFilterChips
