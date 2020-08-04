/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'

import CollectionHeader from './CollectionHeader'
import CollectionDownload from './CollectionDownload'
import CollectionItem from './CollectionItem'
import CollectionSort from './CollectionSort'
import { Pagination } from '../../components/'

function CollectionList({
  totalItems,
  itemName,
  addItemUrl,
  downloadUrl,
  items,
  onPageClick,
  getPageUrl,
  activePage,
  itemsPerPage,
  sortOptions,
  sortInput,
  sortOnChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <>
      <CollectionHeader
        totalItems={totalItems}
        itemName={itemName}
        addItemUrl={addItemUrl}
      />

      {sortOptions && (
        <CollectionSort
          sortInput={sortInput}
          sortOnChange={sortOnChange}
          totalPages={totalPages}
          activePage={activePage}
        >
          {sortOptions}
        </CollectionSort>
      )}

      <CollectionDownload
        totalItems={totalItems}
        itemName={itemName}
        downloadUrl={downloadUrl}
      />

      {items.map(
        (
          { headingText, headingUrl, subheading, badges, metadata, type },
          index
        ) => (
          <CollectionItem
            key={[totalItems, activePage, index].join('-')}
            headingUrl={headingUrl}
            headingText={headingText}
            subheading={subheading}
            badges={badges}
            metadata={metadata}
            type={type}
          />
        )
      )}

      <Pagination
        totalPages={totalPages}
        activePage={activePage}
        onPageClick={onPageClick}
        getPageUrl={getPageUrl}
      />
    </>
  )
}

CollectionList.propTypes = {
  totalItems: PropTypes.number,
  itemName: PropTypes.string,
  addItemUrl: PropTypes.string,
  downloadUrl: PropTypes.string,
  items: PropTypes.array,
  onPageClick: PropTypes.func,
  getPageUrl: PropTypes.func,
  activePage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  sortOptions: PropTypes.node,
  sortInput: PropTypes.object,
  sortOnChange: PropTypes.func,
}

CollectionList.defaultProps = {
  totalItems: 0,
  itemName: 'result',
  addItemUrl: null,
  downloadUrl: null,
  items: [],
  onPageClick: null,
  getPageUrl: (page) => `#page-${page}`,
  activePage: 1,
  itemsPerPage: 10,
  sortOptions: null,
  sortInput: null,
  sortOnChange: null,
}

export default CollectionList
