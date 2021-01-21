/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'

import { GridRow, GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'

import {
  CollectionHeader,
  CollectionSort,
  CollectionItem,
  Pagination,
} from '../../components'

const CollectionList = ({
  results = [],
  itemsPerPage = 10,
  sortOptions,
  taskProps,
  count = 0,
  isComplete,
  collectionName = 'result',
  items,
  activePage = 1,
  onPageClick,
}) => (
  <GridRow>
    <GridCol setWidth="full">
      <article>
        {isComplete && (
          <CollectionHeader
            totalItems={count}
            collectionName={collectionName}
          />
        )}

        {sortOptions && (
          <CollectionSort sortOptions={sortOptions} totalPages={count} />
        )}

        {items.map(
          (
            { headingText, headingUrl, subheading, badges, metadata, type },
            index
          ) => (
            <CollectionItem
              key={[count, activePage, index].join('-')}
              headingUrl={headingUrl}
              headingText={headingText}
              subheading={subheading}
              badges={badges}
              metadata={metadata}
              type={type}
            />
          )
        )}

        <Task.Status {...taskProps}>
          {() =>
            isComplete && (
              <>
                {results.map((item, i) => (
                  <CollectionItem {...item} key={i} />
                ))}
                <Pagination
                  totalPages={Math.ceil(count / itemsPerPage)}
                  onPageClick={onPageClick}
                  activePage={activePage}
                />
              </>
            )
          }
        </Task.Status>
      </article>
    </GridCol>
  </GridRow>
)

CollectionList.propTypes = {
  taskProps: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    progressMessage: PropTypes.string,
    startOnRender: PropTypes.shape({
      payload: PropTypes.shape({
        page: PropTypes.number,
        filters: PropTypes.object,
        search: PropTypes.string,
      }).isRequired,
      onSuccessDispatch: PropTypes.string,
    }).isRequired,
  }),
  isComplete: PropTypes.bool,
  children: PropTypes.node,
  collectionName: PropTypes.string,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }),
  onPageClick: PropTypes.func.isRequired,
}

export default CollectionList
