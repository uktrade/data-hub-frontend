import React from 'react'

import ExportItemRenderer from './ExportItemRenderer'

export const ExportNewInteractionsItemRenderer = (
  item,
  onDeleteReminder,
  disableDelete
) => (
  <ExportItemRenderer
    item={item}
    onDeleteReminder={onDeleteReminder}
    disableDelete={disableDelete}
    hintLabel="Date of interaction"
    headerLinkTitle={`New interaction recorded for ${item.company.name}`}
  />
)
