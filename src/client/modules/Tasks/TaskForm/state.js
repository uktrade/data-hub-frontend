import urls from '../../../../lib/urls'
import { transformIdNameToValueLabel } from '../../../transformers'
import { INVESTMENT_PROJECT_ID } from '../../Investments/Projects/state'
import { ID as TASK_DETAILS_ID } from '../TaskDetails/state'
import { transformAPIValuesForForm } from './transformers'

export const TASK_SAVE_TASK_DETAILS = 'TASK_SAVE_TASK_DETAILS'

export const getGenericBreadcumbs = (task) => {
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

export const getInvestmentProjectBreadcumbs = (investmentProject) => {
  const defaultBreadcrumbs = [
    { link: urls.dashboard.myTasks(), text: 'Home' },
    { link: urls.investments.index(), text: 'Investments' },
    { link: urls.investments.projects.index(), text: 'Projects' },
  ]
  if (investmentProject) {
    return [
      ...defaultBreadcrumbs,
      {
        link: urls.investments.projects.tasks.index(investmentProject.value),
        text: investmentProject.label,
      },
      { text: 'Task' },
    ]
  }

  return defaultBreadcrumbs
}

export const getCompanyBreadcrumbs = (company) => [
  { link: urls.dashboard.myTasks(), text: 'Home' },
  { link: urls.companies.index(), text: 'Companies' },
  {
    link: urls.companies.detail(company.value),
    text: company.label,
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
    return getCompanyBreadcrumbs(task.company)
  }
  return getGenericBreadcumbs(task)
}

export const state2props = (state) => {
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
    const transformedProject = transformIdNameToValueLabel(project)
    return {
      task: { investmentProject: transformedProject },
      currentAdviserId,
      breadcrumbs: getInvestmentProjectBreadcumbs(transformedProject),
    }
  }

  return {
    task: null,
    currentAdviserId,
    breadcrumbs: getGenericBreadcumbs(task),
  }
}
