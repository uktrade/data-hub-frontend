import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskAmendedByOthersSettings',
  () => `v4/reminder/subscription/task-amended-by-others`
)
