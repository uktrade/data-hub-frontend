import React from 'react'
import { storiesOf } from '@storybook/react'
import CollectionHeader from '../CollectionHeader'

const collectionStories = storiesOf('Collection', module)

collectionStories.add('Collection Header', () => (
  <CollectionHeader
    totalItems={1}
    itemName="profile"
    addItemText="#"
    addItemUrl="#"
  />
))

collectionStories.add('Collection Header', () => (
  <CollectionHeader totalItems={1} itemName="profile" addItemUrl="#" />
))
