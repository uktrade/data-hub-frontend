import React from 'react'
import { Chip } from '../../components'

const OptionFilterChips = ({ selectedOptions }) => {
  return (
    <>
      {selectedOptions.map(({ label, value }) => (
        <Chip key={value}>{label}</Chip>
      ))}
    </>
  )
}

export default OptionFilterChips
