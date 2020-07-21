import React from 'react'
import { storiesOf } from '@storybook/react'

import CollectionItem from '../CollectionItem'

import capitalProfileItem from '../__fixtures__/capitalProfileItem.json'
import interactionItem from '../__fixtures__/interactionItem.json'

const collectionStories = storiesOf('Collection', module)

collectionStories.add('Capital Profile item', () => (
  <CollectionItem {...capitalProfileItem} />
))

collectionStories.add('Interaction item', () => (
  <CollectionItem {...interactionItem} type="interaction" />
))

collectionStories.add('Item without link', () => (
  <CollectionItem
    headingText={capitalProfileItem.headingText}
    subheading={capitalProfileItem.subheading}
    badges={capitalProfileItem.badges}
    metadata={capitalProfileItem.metadata}
  />
))
