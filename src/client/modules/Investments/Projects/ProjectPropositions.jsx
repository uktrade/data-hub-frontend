import { connect, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { H2, Button, Link } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import qs from 'qs'
import { get } from 'lodash'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { CollectionList } from '../../../components'
import {
  InvestmentResource,
  PropositionCollectionResource,
} from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { transformPropositionToListItem } from './transformers'
import ProjectLayout from '../../../components/Layout/ProjectLayout'

import { ID, TASK_PROPOSITION_COMPLETE, propositionState2props } from './state'
import { PROPOSITION_COMPLETE } from '../../../../client/actions'
import { BLACK, GREY_3 } from '../../../utils/colours'
import Task from '../../../../client/components/Task'

const buttonRenderer =
  (taskCompleteStatus) =>
  ({ id, investment_project_id, status }) => {
    if (status === 'abandoned' || status === 'completed') {
      return null
    }
    return (
      <>
        {taskCompleteStatus === 'completed' ? null : (
          <div>
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
                const handleCompleteTask = () => {
                  postCompleteTask.start({
                    payload: {
                      investmentProjectId: investment_project_id,
                      propositionId: id,
                    },
                    onSuccessDispatch: PROPOSITION_COMPLETE,
                  })
                }
                return (
                  <Button
                    onClick={handleCompleteTask}
                    data-test="complete-button"
                  >
                    Complete
                  </Button>
                )
              }}
            </Task>
          </div>
        )}
      </>
    )
  }

const mapDispatchToProps = (dispatch) => ({
  writeFlashMessage: (messageType, message) =>
    dispatch({
      type: 'FLASH_MESSAGE__WRITE_TO_SESSION',
      messageType,
      message,
    }),
  getFlashMessagesFromSession: () =>
    dispatch({
      type: 'FLASH_MESSAGE__GET_FROM_SESSION',
    }),
})

const ProjectPropositions = ({
  writeFlashMessage,
  getFlashMessagesFromSession,
  completeStatus,
}) => {
  const history = useHistory()
  const location = useLocation()
  const parsedQueryString = qs.parse(location.search.slice(1))
  const activePage = parseInt(parsedQueryString.page, 10) || 1

  const { projectId } = useParams()

  const taskState = useSelector((state) =>
    get(state, ['tasks', TASK_PROPOSITION_COMPLETE, ID], {})
  )
  useEffect(() => {
    if (taskState.status === 'error') {
      writeFlashMessage('error', taskState.errorMessage)
      getFlashMessagesFromSession()
    }
  }, [taskState.status, taskState.errorMessage, writeFlashMessage])
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
                breadcrumbs={[
                  {
                    link: urls.investments.projects.details(project.id),
                    text: project.name,
                  },
                  { text: 'Propositions' },
                ]}
                pageTitle="Propositions"
                flashMessages={
                  completeStatus === 'completed'
                    ? { success: ['Proposition Completed'] }
                    : taskState.status === 'error'
                    ? { error: [taskState.errorMessage] }
                    : null
                }
              >
                <H2 size={LEVEL_SIZE[3]}>Investment Propositions</H2>
                <p>
                  You can record and manage propositions requested by investors
                  and view the details of previous and current propositions.
                </p>
                <CollectionList
                  footerRenderer={buttonRenderer(completeStatus)}
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

export default connect(
  propositionState2props,
  mapDispatchToProps
)(ProjectPropositions)
