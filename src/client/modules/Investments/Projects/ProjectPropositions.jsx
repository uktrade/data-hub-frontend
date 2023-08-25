import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import qs from 'qs'
import { useHistory, useLocation } from 'react-router-dom'

import { CollectionList } from '../../../components'
import { PropositionCollectionResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { transformPropositionToListItem } from './transformers'

const ProjectPropositions = ({ projectId }) => {
  const history = useHistory()
  const location = useLocation()
  const parsedQueryString = qs.parse(location.search.slice(1))
  const activePage = parseInt(parsedQueryString.page, 10) || 1
  return (
    <PropositionCollectionResource
      payload={{
        investment_project_id: projectId,
        limit: 10,
        offset: activePage * 10 - 10,
        sortby: parsedQueryString.sortby,
      }}
    >
      {(_, count, rawData) => {
        const propositions = rawData.results.map(transformPropositionToListItem)
        const sortOptions = [
          {
            name: 'Recently created',
            value: '-created_on',
          },
          {
            name: 'Oldest',
            value: 'created_on',
          },
        ]

        return (
          <>
            <H2 size={LEVEL_SIZE[3]}>Investment Propositions</H2>
            <p>
              You can record and manage propositions requested by investors and
              view the details of previous and current propositions.
            </p>
            <CollectionList
              collectionName="proposition"
              items={propositions}
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
              addItemUrl={urls.investments.projects.proposition.create(
                projectId
              )}
            />
          </>
        )
      }}
    </PropositionCollectionResource>
  )
}

ProjectPropositions.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default ProjectPropositions
