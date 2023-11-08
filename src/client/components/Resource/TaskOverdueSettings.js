import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskOverdueSettings',
  () => `v4/reminder/subscription/my-tasks-task-overdue`
)
