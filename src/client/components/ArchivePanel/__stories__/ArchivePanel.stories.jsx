import React from 'react'
import { storiesOf } from '@storybook/react'

import ArchivePanel from 'ArchivePanel'

const archivist = {
  first_name: 'Example',
  last_name: 'Archivist',
}

storiesOf('ArchivePanel', module)
  .addParameters({ component: ArchivePanel })
  .add('Archived item', () => (
    <ArchivePanel
      isArchived={true}
      archivedBy={archivist}
      archivedOn={'2022-01-01'}
      archiveReason={'Example archival reason'}
      unarchiveUrl={'#'}
      type={'item'}
    />
  ))
  .add('Automatically archived item', () => (
    <ArchivePanel
      isArchived={true}
      archivedBy={null}
      archivedOn={'2022-01-01'}
      archiveReason={'Example archival reason'}
      unarchiveUrl={'#'}
      type={'item'}
    />
  ))
