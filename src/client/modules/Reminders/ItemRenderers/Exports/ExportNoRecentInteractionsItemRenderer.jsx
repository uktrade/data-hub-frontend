import React from 'react'

import ExportItemRenderer from './ExportItemRenderer'

export const ExportNoRecentInteractionsItemRenderer = (
  item,
  onDeleteReminder,
  disableDelete
) => (
  <ExportItemRenderer
    item={item}
    onDeleteReminder={onDeleteReminder}
    disableDelete={disableDelete}
    hintLabel="Date of last interaction"
    headerLinkTitle={`No interaction recorded for ${item.company.name}`}
  />
)
