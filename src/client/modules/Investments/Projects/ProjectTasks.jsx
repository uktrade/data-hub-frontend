import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import { CollectionList } from '../../../components'
import {
  InvestmentProjectTasksResource,
  InvestmentResource,
} from '../../../components/Resource'
import urls from '../../../../lib/urls'
import ProjectLayout from '../../../components/Layout/ProjectLayout'
import { transformTaskToListItem } from './transformers'
import { useSearchParam } from 'react-use'
import { ITEMS_PER_PAGE } from './constants'

const ProjectTasks = () => {
  const { projectId } = useParams()

  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const getPageUrl = (page) => `${window.location.pathname}?page=${page}`
  const setActivePage = (page) =>
    window.history.pushState({}, '', getPageUrl(page))

  const onPageClick = (page) => {
    setActivePage(page)
  }

  return (
    // TODO move this into project layout
    <InvestmentResource id={projectId}>
      {(project) => (
        <ProjectLayout
          project={project}
          breadcrumbs={[
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            { text: 'Tasks' },
          ]}
          pageTitle="Tasks"
        >
          <H2 size={LEVEL_SIZE[3]}>Investment tasks</H2>
          <p>
            An investment tasks is an upcoming action that is associated with
            this investment project. Once a task is marked as complete it will
            not be visible here.
          </p>
          <InvestmentProjectTasksResource
            payload={{
              investment_project: projectId,
              limit: ITEMS_PER_PAGE,
              offset: activePage * ITEMS_PER_PAGE - ITEMS_PER_PAGE,
              sortby: 'task__due_date',
            }}
          >
            {(_, count, rawData) => {
              const tasks = rawData.results.map(transformTaskToListItem)
              return (
                <CollectionList
                  addItemUrl={'#'} //TODO this needs a link to go to the add task page
                  collectionName="tasks"
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
      )}
    </InvestmentResource>
  )
}

export default ProjectTasks
