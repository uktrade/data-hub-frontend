import React from 'react'
import { Route } from 'react-router-dom'
import qs from 'qs'

import { CollectionList } from '../../../../../client/components'
import { transformInteractionToListItem } from '../../../../interactions/client/transformers'
import Interactions from '../../../../../client/components/Resource/Interactions'

const OpportunityInteractions = ({ opportunityId }) => (
  <Route>
    {({ history, location }) => {
      const parsedQueryString = qs.parse(location.search.slice(1))
      const activePage = parseInt(parsedQueryString.page, 10) || 1
      return (
        <Interactions
          payload={{
            large_capital_opportunity_id: opportunityId,
            limit: 10,
            offset: activePage * 10 - 10,
            sortby: parsedQueryString.sortby,
          }}
        >
          {(_, count, rawData) => {
            const interactions = rawData.results.map(
              transformInteractionToListItem
            )
            const sortOptions = [
              {
                name: 'Recently created',
                value: '-date',
              },
              {
                name: 'Oldest',
                value: 'date',
              },
            ]

            return (
              <CollectionList
                collectionName="interactions"
                items={interactions}
                count={count}
                isComplete={true}
                onPageClick={(currentPage) =>
                  history.push({
                    search: qs.stringify({
                      ...parsedQueryString,
                      page: currentPage,
                    }),
                  })
                }
                activePage={activePage}
                sortOptions={count ? sortOptions : null}
              />
            )
          }}
        </Interactions>
      )
    }}
  </Route>
)
export default OpportunityInteractions
