import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import Pagination from 'Pagination'

const collectionStories = storiesOf('Pagination', module)

const PaginationWithState = () => {
  const [activePage, setActivePage] = useState(1)

  return (
    <Pagination
      activePage={activePage}
      totalPages={1000}
      onPageClick={(page, event) => {
        setActivePage(page)
        event.preventDefault()
      }}
    />
  )
}

collectionStories.add('Default', () => <PaginationWithState />)
