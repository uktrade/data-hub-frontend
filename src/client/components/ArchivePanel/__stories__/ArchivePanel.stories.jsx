import React from 'react'

import ArchivePanel from '..'

const archivist = {
  first_name: 'Example',
  last_name: 'Archivist',
}

export default {
  title: 'ArchivePanel',

  parameters: {
    component: ArchivePanel,
  },
}

export const ArchivedItem = () => (
  <ArchivePanel
    isArchived={true}
    archivedBy={archivist}
    archivedOn={'2022-01-01'}
    archiveReason={'Example archival reason'}
    unarchiveUrl={'#'}
    type={'item'}
  />
)

ArchivedItem.story = {
  name: 'Archived item',
}

export const AutomaticallyArchivedItem = () => (
  <ArchivePanel
    isArchived={true}
    archivedBy={null}
    archivedOn={'2022-01-01'}
    archiveReason={'Example archival reason'}
    unarchiveUrl={'#'}
    type={'item'}
  />
)

AutomaticallyArchivedItem.story = {
  name: 'Automatically archived item',
}
