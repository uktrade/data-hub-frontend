import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskAmendedByOthersSettings',
  () => `v4/reminder/subscription/my-tasks-task-amended-by-others`
)
