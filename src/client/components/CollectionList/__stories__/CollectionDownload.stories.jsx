import React from 'react'
import { storiesOf } from '@storybook/react'
import CollectionDownload from '../CollectionDownload'

const collectionStories = storiesOf('Collection', module)

collectionStories.add('Collection Download - no items', () => (
  <CollectionDownload totalItems={0} itemName="profile" downloadUrl="#" />
))

collectionStories.add('Collection Download - 1 item', () => (
  <CollectionDownload totalItems={1} itemName="profile" downloadUrl="#" />
))

collectionStories.add('Collection Download - 101 items', () => (
  <CollectionDownload totalItems={101} itemName="profile" downloadUrl="#" />
))

collectionStories.add('Collection Download - need to filter', () => (
  <CollectionDownload totalItems={5001} itemName="profile" downloadUrl="#" />
))
