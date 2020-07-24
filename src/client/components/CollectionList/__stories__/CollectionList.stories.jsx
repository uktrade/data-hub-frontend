import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import CollectionList from 'CollectionList'

import profilesFixture from '../__fixtures__/capitalProfiles.json'

const collectionStories = storiesOf('Collection', module)

const CollectionWithState = () => {
  const [activePage, setActivePage] = useState(1)

  const index = activePage - 1
  const offset = index * 10
  const limit = (index + 1) * 10

  const items = profilesFixture.slice(offset, limit)

  return (
    <CollectionList
      items={items}
      onPageClick={(page, event) => {
        setActivePage(page)
        event.preventDefault()
      }}
      activePage={activePage}
      totalItems={profilesFixture.length}
      itemName="profile"
      addItemUrl="http://example.com"
      downloadUrl="http://example.com"
    />
  )
}

collectionStories.add('Collection List', () => <CollectionWithState />)

collectionStories.add('Collection List with 0 items', () => (
  <CollectionList totalItems={0} itemName="results" />
))
