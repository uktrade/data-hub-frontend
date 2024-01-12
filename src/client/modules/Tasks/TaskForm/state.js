import urls from '../../../../lib/urls'
import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../../transformers'
import {
  INVESTMENT_PROJECTS_ID,
  INVESTMENT_PROJECT_ID,
} from '../../Investments/Projects/state'
import { ID as TASK_DETAILS_ID } from '../TaskDetails/state'
import { transformAPIValuesForForm } from './transformers'
import { ID as INTERACTION_ID } from '../../Interactions/InteractionDetails/state'

export const TASK_SAVE_TASK_DETAILS = 'TASK_SAVE_TASK_DETAILS'

export const getGenericBreadcumbs = (task, isCopy = false) => {
  const defaultBreadcrumbs = [{ link: urls.dashboard.myTasks(), text: 'Home' }]
  if (task && !isCopy) {
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

export const getInteractionBreadcrumbs = (interaction) => [
  { link: urls.dashboard.myTasks(), text: 'Home' },
  { link: urls.interactions.index(), text: 'Interactions' },
  {
    link: urls.interactions.detail(interaction.id),
    text: interaction.subject,
  },
  { text: 'Task' },
]

export const getTaskBreadcrumbs = (task, isCopy = false) => {
  if (!task) {
    return getGenericBreadcumbs(task)
  }
  if (task.investmentProject) {
    return getInvestmentProjectBreadcumbs(task.investmentProject)
  }
  if (task.interaction) {
    return getInteractionBreadcrumbs(task.interaction)
  }
  if (task.company) {
    return getCompanyBreadcrumbs(task.company)
  }

  return getGenericBreadcumbs(task, isCopy)
}

export const state2props = (state) => {
  const currentAdviserId = state.currentAdviserId
  const { task, copyTask } = state[TASK_DETAILS_ID]
  const { project } = state[INVESTMENT_PROJECT_ID]
  const { results } = state[INVESTMENT_PROJECTS_ID]
  const { interaction } = state[INTERACTION_ID]

  const companyInvestmentProjects =
    Array.isArray(results) && results.length > 0
      ? transformArrayIdNameToValueLabel(results)
      : null

  const defaultTaskProps = {
    currentAdviserId,
    companyInvestmentProjects: companyInvestmentProjects,
  }

  if (task) {
    const transformedTask = transformAPIValuesForForm(task, currentAdviserId)
    if (copyTask) {
      delete transformedTask.id
      delete transformedTask.title
      delete transformedTask.description
    }
    return {
      ...defaultTaskProps,
      task: transformedTask,
      breadcrumbs: getTaskBreadcrumbs(transformedTask, copyTask),
    }
  }

  if (project) {
    const transformedProject = transformIdNameToValueLabel(project)
    const transformedCompany = transformIdNameToValueLabel(
      project.investorCompany
    )
    return {
      ...defaultTaskProps,
      task: {
        investmentProject: transformedProject,
        company: transformedCompany,
      },
      breadcrumbs: getInvestmentProjectBreadcumbs(transformedProject),
    }
  }

  if (interaction) {
    return {
      ...defaultTaskProps,
      task: {
        interaction: interaction,
        title: interaction.subject,
        description: interaction.notes,
      },
      breadcrumbs: getInteractionBreadcrumbs(interaction),
    }
  }

  return {
    ...defaultTaskProps,
    task: null,
    breadcrumbs: getGenericBreadcumbs(task),
  }
}
