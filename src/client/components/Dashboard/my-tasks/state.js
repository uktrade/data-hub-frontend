export const TASK_CHECK_FOR_MY_TASKS = 'TASK_CHECK_FOR_MY_TASKS'

export const ID = 'myTasks'

export const state2props = (state) => {
  const { adviserId } = state
  return { adviserId }
}
