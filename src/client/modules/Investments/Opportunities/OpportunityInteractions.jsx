import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'

import { getQueryParamsFromLocation } from '../../../utils/url'
import { CollectionList } from '../../../components'
import { transformInteractionToListItem } from '../../../../apps/interactions/client/transformers'
import { InteractionCollectionResource } from '../../../components/Resource'

const OpportunityInteractions = ({ opportunityId }) => {
  const history = useHistory()
  const parsedQueryString = getQueryParamsFromLocation(useLocation())
  const activePage = parseInt(parsedQueryString.page, 10) || 1
  return (
    <InteractionCollectionResource
      payload={{
        large_capital_opportunity_id: opportunityId,
        limit: 10,
        offset: activePage * 10 - 10,
        sortby: parsedQueryString.sortby,
      }}
    >
      {(_, count, rawData) => {
        const interactions = rawData.results.map(transformInteractionToListItem)
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
    </InteractionCollectionResource>
  )
}
export default OpportunityInteractions
