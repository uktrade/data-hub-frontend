import urls from '../../../../lib/urls'
import { INVESTMENT_PROJECT_ID } from '../../Investments/Projects/state'
import { ID as TASK_DETAILS_ID } from '../TaskDetails/state'
import { transformAPIValuesForForm } from './transformers'

export const TASK_SAVE_TASK_DETAILS = 'TASK_SAVE_TASK_DETAILS'

const getGenericBreadcumbs = (task) => {
  const defaultBreadcrumbs = [{ link: urls.dashboard.myTasks(), text: 'Home' }]
  if (task) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.tasks.details(task.id),
        text: task.title,
      },
      {
        text: 'Task',
      },
    ]
  }

  return [
    ...defaultBreadcrumbs,
    {
      text: 'Task',
    },
  ]
}

const getInvestmentProjectBreadcumbs = (investmentProject) => {
  const defaultBreadcrumbs = [
    { link: urls.dashboard.myTasks(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.projects.index(), text: 'Projects' },
  ]
  if (investmentProject) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.investments.projects.tasks.index(investmentProject.id),
        text: investmentProject.name,
      },
      { text: 'Task' },
    ]
  }

  return defaultBreadcrumbs
}

const getCompanyBreadcrumbs = (task) => [
  { link: urls.dashboard.myTasks(), text: 'Home' },
  { link: urls.companies.index(), text: 'Companies' },
  {
    link: urls.companies.detail(task.company.value),
    text: task.company.label,
  },
  { text: 'Task' },
]

export const getTaskBreadcrumbs = (task) => {
  if (!task) {
    return getGenericBreadcumbs(task)
  }
  if (task.investmentProject) {
    return getInvestmentProjectBreadcumbs(task.investmentProject)
  }
  if (task.company) {
    return getCompanyBreadcrumbs(task)
  }
  return getGenericBreadcumbs(task)
}

export const state2props = ({ router, ...state }) => {
  const currentAdviserId = state.currentAdviserId
  const { task } = state[TASK_DETAILS_ID]
  const { project } = state[INVESTMENT_PROJECT_ID]

  if (task) {
    const transformedTask = transformAPIValuesForForm(task, currentAdviserId)
    return {
      task: transformedTask,
      currentAdviserId,
      breadcrumbs: getTaskBreadcrumbs(transformedTask),
    }
  }

  if (project) {
    return {
      task: { investmentProject: project },
      currentAdviserId,
      breadcrumbs: getInvestmentProjectBreadcumbs(project),
    }
  }

  return {
    task: null,
    currentAdviserId,
    breadcrumbs: getGenericBreadcumbs(task),
  }
}
