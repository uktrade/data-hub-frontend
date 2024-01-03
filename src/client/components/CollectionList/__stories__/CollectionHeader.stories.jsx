import React from 'react'

import CollectionHeader from '../CollectionHeader'

export default {
  title: 'Collection/CollectionHeader',
  parameters: {
    component: CollectionHeader,
  },
}

export const _CollectionHeader = () => (
  <CollectionHeader
    totalItems={1}
    itemName="profile"
    addItemText="#"
    addItemUrl="#"
  />
)

export const __CollectionHeader = () => (
  <CollectionHeader totalItems={1} itemName="profile" addItemUrl="#" />
)
