import { connect } from 'react-redux'
import React from 'react'
import { H2, Button, Link } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import qs from 'qs'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { CollectionList } from '../../../components'
import {
  InvestmentResource,
  PropositionCollectionResource,
} from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { transformPropositionToListItem } from './transformers'
import ProjectLayout from '../../../components/Layout/ProjectLayout'
// import button from './ButtonRenderer'

import { ID, TASK_PROPOSITION_COMPLETE, propositionState2props } from './state'
import { PROPOSITION_COMPLETE } from '../../../../client/actions'
import { BLACK, GREY_3 } from '../../../utils/colours'
import Task from '../../../../client/components/Task'

const errorMessage = ''

const buttonRenderer = ({ id, investment_project_id, status }) => {
  if (status === 'abandoned' || status === 'completed') {
    return null
  }
  return (
    <>
      <Button
        as={Link}
        href={urls.investments.projects.proposition.abandon(
          investment_project_id,
          id
        )}
        data-test="abandon-button"
        buttonColour={GREY_3}
        buttonTextColour={BLACK}
      >
        Abandon
      </Button>{' '}
      <Task>
        {(getTask) => {
          const postCompleteTask = getTask(TASK_PROPOSITION_COMPLETE, ID)
          return (
            <Button
              onClick={() =>
                postCompleteTask.start({
                  payload: {
                    investmentProjectId: investment_project_id,
                    propositionId: id,
                  },
                  onSuccessDispatch: PROPOSITION_COMPLETE,
                })
              }
              data-test="complete-button"
            >
              {postCompleteTask.error
                ? (errorMessage = postCompleteTask.errorMessage)
                : null}
              Complete
            </Button>
          )
        }}
      </Task>
    </>
  )
}

// function transformErrorMessage(error) {
//   return get(error, 'non_field_errors', ['There has been an error'])[0]
// }

const ProjectPropositions = () => {
  const history = useHistory()
  const location = useLocation()
  const parsedQueryString = qs.parse(location.search.slice(1))
  const activePage = parseInt(parsedQueryString.page, 10) || 1

  const { projectId } = useParams()

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
        const propositions = rawData.results.map((item) =>
          transformPropositionToListItem(item)
        )
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
          <InvestmentResource id={projectId}>
            {(project) => (
              <ProjectLayout
                project={project}
                flashMessages={{ error: [errorMessage], success: [] }}
                breadcrumbs={[
                  {
                    link: urls.investments.projects.details(project.id),
                    text: project.name,
                  },
                  { text: 'Propositions' },
                ]}
                pageTitle="Propositions"
              >
                <H2 size={LEVEL_SIZE[3]}>Investment Propositions</H2>
                <p>
                  You can record and manage propositions requested by investors
                  and view the details of previous and current propositions.
                </p>
                <CollectionList
                  footerRenderer={buttonRenderer}
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
              </ProjectLayout>
            )}
          </InvestmentResource>
        )
      }}
    </PropositionCollectionResource>
  )
}

export default connect(propositionState2props)(ProjectPropositions)
