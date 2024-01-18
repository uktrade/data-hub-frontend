import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import qs from 'qs'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { CollectionList } from '../../../components'
import { transformInteractionToListItem } from '../../../../apps/interactions/client/transformers'
import {
  InteractionCollectionResource,
  InvestmentResource,
} from '../../../components/Resource'
import urls from '../../../../lib/urls'
import ProjectLayout from '../../../components/Layout/ProjectLayout'
import { INTERACTIONS__LOADED } from '../../../actions'
import { TASK_GET_INTERACTIONS_LIST } from '../../Interactions/CollectionList/state'

const ProjectInteractions = () => {
  const history = useHistory()
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

  const collectionListTask = {
    name: TASK_GET_INTERACTIONS_LIST,
    id: projectId,
    progressMessage: 'Loading interactions',
    startOnRender: {
      payload: payload,
      onSuccessDispatch: INTERACTIONS__LOADED,
    },
  }
  return (
    <InteractionCollectionResource payload={payload}>
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
          <InvestmentResource id={projectId}>
            {(project) => (
              <ProjectLayout
                project={project}
                breadcrumbs={[
                  {
                    link: urls.investments.projects.details(project.id),
                    text: project.name,
                  },
                  { text: 'Interactions' },
                ]}
                pageTitle="Interactions"
              >
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
                    history.push({
                      search: qs.stringify({
                        ...parsedQueryString,
                        page: currentPage,
                      }),
                    })
                  }
                  taskProps={collectionListTask}
                  activePage={activePage}
                  sortOptions={count ? sortOptions : null}
                  addItemUrl={urls.investments.projects.interactions.createType(
                    projectId,
                    'investment',
                    'interaction'
                  )}
                />
              </ProjectLayout>
            )}
          </InvestmentResource>
        )
      }}
    </InteractionCollectionResource>
  )
}

export default ProjectInteractions
