import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskAssignedToMeFromOthersSettings',
  () => `v4/reminder/subscription/task-assigned-to-me-from-others`
)
