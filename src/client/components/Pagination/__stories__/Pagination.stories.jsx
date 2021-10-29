import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import RoutedPagination from '../RoutedPagination'
import Pagination from '../'

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

const RoutedPaginationWithState = () => {
  const exampleItems = [...Array(150).keys()].map((i) => ({
    id: i + 1,
    name: 'Item ' + (i + 1),
  }))

  const [items, setItems] = useState({
    exampleItems,
    pageOfItems: [],
  })

  const onChangePage = (newPager) => {
    const pageOfItems = exampleItems.slice(
      newPager.startIndex,
      newPager.endIndex + 1
    )

    setItems({
      ...items,
      pageOfItems,
    })
  }
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <p>Total items: {exampleItems.length}</p>
        {items.pageOfItems.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
      <RoutedPagination
        items={exampleItems.length}
        onChangePage={onChangePage}
      />
    </>
  )
}

storiesOf('Pagination', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Default', () => <PaginationWithState />)
  .add('Routed', () => <RoutedPaginationWithState />)
