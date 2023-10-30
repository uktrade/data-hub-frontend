import { createEntityResource } from './Resource'

export default createEntityResource(
  'MyTasksDueDateApproachingSettings',
  () => `v4/reminder/subscription/my-tasks-due-date-approaching`
)
