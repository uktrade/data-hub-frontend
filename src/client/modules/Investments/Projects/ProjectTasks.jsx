import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { connect } from 'react-redux'

import { CollectionList } from '../../../components'
import { InvestmentProjectTasksResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import ProjectLayout from '../../../components/Layout/ProjectLayout'
import { transformTaskToListItem } from './transformers'
import { ITEMS_PER_PAGE } from './constants'
import Task from '../../../components/Task'
import {
  INVESTMENT_PROJECT_ID,
  TASK_GET_INVESTMENT_PROJECT,
  investmentProjectState2props,
} from './state'
import { INVESTMENT__PROJECT_LOADED } from '../../../actions'

const ProjectTasks = ({ project }) => {
  const { projectId } = useParams()

  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const getPageUrl = (page) => `${window.location.pathname}?page=${page}`
  const setActivePage = (page) =>
    window.history.pushState({}, '', getPageUrl(page))

  const onPageClick = (page) => {
    setActivePage(page)
  }

  return (
    <ProjectLayout
      project={project}
      breadcrumbs={
        project
          ? [
              {
                link: urls.investments.projects.details(project.id),
                text: project.name,
              },
              { text: 'Tasks' },
            ]
          : []
      }
      pageTitle="Tasks"
    >
      <H2 size={LEVEL_SIZE[3]}>Investment tasks</H2>
      <p>
        An investment tasks is an upcoming action that is associated with this
        investment project. Once a task is marked as complete it will not be
        visible here.
      </p>
      <Task.Status
        name={TASK_GET_INVESTMENT_PROJECT}
        id={INVESTMENT_PROJECT_ID}
        startOnRender={{
          payload: projectId,
          onSuccessDispatch: INVESTMENT__PROJECT_LOADED,
        }}
      />
      <InvestmentProjectTasksResource
        payload={{
          investment_project: projectId,
          limit: ITEMS_PER_PAGE,
          offset: activePage * ITEMS_PER_PAGE - ITEMS_PER_PAGE,
          sortby: 'task__due_date',
          archived: false,
        }}
      >
        {(projectTasks, count) => {
          const tasks = projectTasks.map(transformTaskToListItem)

          return (
            <CollectionList
              addItemUrl={urls.investments.projects.tasks.create(projectId)}
              collectionName="task"
              items={tasks}
              count={count}
              isComplete={true}
              onPageClick={onPageClick}
              activePage={activePage}
            />
          )
        }}
      </InvestmentProjectTasksResource>
    </ProjectLayout>
  )
}

export default connect(investmentProjectState2props)(ProjectTasks)
