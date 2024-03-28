import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import qs from 'qs'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { CollectionList } from '../../../components'
import { transformInteractionToListItem } from '../../../../apps/interactions/client/transformers'
import { InteractionCollectionResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import InvestmentName from './InvestmentName'
import ProjectLayoutNew from '../../../components/Layout/ProjectLayoutNew'

const ProjectInteractions = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const parsedQueryString = qs.parse(location.search.slice(1))
  const activePage = parseInt(parsedQueryString.page, 10) || 1

  const { projectId } = useParams()

  const payload = {
    investment_project_id: projectId,
    limit: 10,
    offset: activePage * 10 - 10,
    sortby: parsedQueryString.sortby,
  }

  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Interactions' },
      ]}
      pageTitle="Interactions"
    >
      <InteractionCollectionResource payload={payload}>
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
            <>
              <H2 size={LEVEL_SIZE[3]}>Investment Interactions</H2>
              <p>
                An interaction could be a meeting, call, email or another
                activity associated with this investment.
              </p>
              <CollectionList
                collectionName="interaction"
                items={interactions}
                count={count}
                isComplete={true}
                onPageClick={(currentPage) =>
                  navigate({
                    search: qs.stringify({
                      ...parsedQueryString,
                      page: currentPage,
                    }),
                  })
                }
                activePage={activePage}
                sortOptions={count ? sortOptions : null}
                addItemUrl={urls.investments.projects.interactions.createType(
                  projectId,
                  'investment',
                  'interaction'
                )}
              />
            </>
          )
        }}
      </InteractionCollectionResource>
    </ProjectLayoutNew>
  )
}

export default ProjectInteractions
