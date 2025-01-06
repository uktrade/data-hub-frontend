import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams, useNavigate } from 'react-router-dom'
import useSearchParam from 'react-use/lib/useSearchParam'
import { connect } from 'react-redux'
import qs from 'qs'

import { CollectionList } from '../../../components'
import { InvestmentProjectTasksResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { transformTaskToListItem } from './transformers'
import { ITEMS_PER_PAGE } from './constants'

import { investmentProjectState2props } from './state'

import InvestmentName from './InvestmentName'
import ProjectLayoutNew from '../../../components/Layout/ProjectLayoutNew'

const ProjectTasks = () => {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const parsedQueryString = qs.parse(location.search.slice(1))
  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const getPageUrl = (page) => `${window.location.pathname}?page=${page}`

  const onPageClick = (page) => {
    navigate(getPageUrl(page))
  }
  const returnUrl = encodeURIComponent(location.pathname + location.search)

  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Tasks' },
      ]}
      pageTitle="Tasks"
    >
      <H2 size={LEVEL_SIZE[3]}>Investment tasks</H2>
      <p>
        An investment task is an upcoming action that is associated with this
        investment project. Once a task is marked as complete it will not be
        visible here.
      </p>
      <InvestmentProjectTasksResource
        payload={{
          investment_project: projectId,
          limit: ITEMS_PER_PAGE,
          offset: activePage * ITEMS_PER_PAGE - ITEMS_PER_PAGE,
          sortby: parsedQueryString.sortby,
        }}
      >
        {(projectTasks, count) => {
          const tasks = projectTasks.map((task) =>
            transformTaskToListItem({ ...task, returnUrl: returnUrl })
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
            {
              name: 'Due date',
              value: 'due_date',
            },
          ]

          return (
            <CollectionList
              addItemUrl={urls.tasks.createInvestmentProject(projectId)}
              collectionName="task"
              items={tasks}
              count={count}
              isComplete={true}
              onPageClick={onPageClick}
              activePage={activePage}
              sortOptions={count ? sortOptions : null}
            />
          )
        }}
      </InvestmentProjectTasksResource>
    </ProjectLayoutNew>
  )
}

export default connect(investmentProjectState2props)(ProjectTasks)
