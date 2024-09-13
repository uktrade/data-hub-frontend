import React, { useState } from 'react'

import CollectionList from '..'

import profilesFixture from '../__fixtures__/capitalProfiles.json'
import { SORT_OPTIONS } from '../../../modules/Investments/Projects/constants'

export default {
  title: 'Collection/CollectionList',

  parameters: {
    component: CollectionList,
  },
}

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
      sortOptions={SORT_OPTIONS}
    />
  )
}

export const _CollectionList = () => <CollectionWithState />

export const CollectionListWith0Items = () => (
  <CollectionList
    totalItems={0}
    items={[]}
    itemName="results"
    sortOptions={SORT_OPTIONS}
  />
)

CollectionListWith0Items.story = {
  name: 'Collection List with 0 items',
}
