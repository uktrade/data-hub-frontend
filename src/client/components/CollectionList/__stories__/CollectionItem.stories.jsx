import React from 'react'

import CollectionItem from '../CollectionItem'
import capitalProfileItem from '../__fixtures__/capitalProfileItem.json'
import interactionItem from '../__fixtures__/interactionItem.json'

export default {
  title: 'Collection',

  parameters: {
    component: CollectionItem,
  },
}

export const CapitalProfileItem = () => (
  <CollectionItem {...capitalProfileItem} />
)

CapitalProfileItem.story = {
  name: 'Capital Profile item',
}

export const InteractionItem = () => (
  <CollectionItem {...interactionItem} type="interaction" />
)

InteractionItem.story = {
  name: 'Interaction item',
}

export const ItemWithoutLink = () => (
  <CollectionItem
    headingText={capitalProfileItem.headingText}
    subheading={capitalProfileItem.subheading}
    badges={capitalProfileItem.badges}
    metadata={capitalProfileItem.metadata}
  />
)

ItemWithoutLink.story = {
  name: 'Item without link',
}
