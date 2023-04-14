import React from 'react'

import { SummaryTable } from '../../../../components'
import { transformArray } from './transformers'

const ProfileLocationTable = ({ profile }) => {
  const { notesOnLocations, otherCountriesBeingConsidered, ukRegionLocations } =
    profile

  return (
    <>
      <SummaryTable.TextRow
        heading="UK locations of interest"
        value={transformArray(ukRegionLocations)}
      />
      <SummaryTable.TextRow
        heading="Other countries the investor is considering"
        value={transformArray(otherCountriesBeingConsidered)}
      />
      <SummaryTable.TextRow
        heading="Notes on investor's location preferences"
        value={notesOnLocations}
      />
    </>
  )
}

export default ProfileLocationTable
