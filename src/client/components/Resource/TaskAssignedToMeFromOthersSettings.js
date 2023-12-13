import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskAssignedToMeFromOthersSettings',
  () => `v4/reminder/subscription/my-tasks-task-assigned-to-me-from-others`
)
