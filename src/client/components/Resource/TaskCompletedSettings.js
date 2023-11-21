import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskCompletedSettings',
  () => `v4/reminder/subscription/my-tasks-task-completed`
)
