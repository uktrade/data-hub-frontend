export const TASK_GET_MY_TASKS = 'TASK_GET_MY_TASKS'

export const ID = 'my_tasks'

export const state2props = (state) => {
  const { adviserId } = state
  return { adviserId }
}
