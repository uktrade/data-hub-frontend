import { get } from 'lodash'

import urls from '../../../../lib/urls'

export const ID = 'taskDetails'

export const TASK_GET_TASK_DETAILS = 'TASK_GET_TASK_DETAILS'
export const TASK_ARCHIVE_TASK = 'TASK_ARCHIVE_TASK'

const getEditUrl = ({ task }) => {
  const investmentProject = get(task, 'investmentProjectTask.investmentProject')
  return investmentProject
    ? urls.investments.projects.tasks.edit(investmentProject.id, task.id)
    : undefined
}
export const state2props = (state) => ({ ...state[ID] })

export const buttonState2props = (state) => {
  const task = state[ID]

  return { editUrl: getEditUrl(task) }
}
