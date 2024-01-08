import { createEntityResource } from './Resource'

export default createEntityResource(
  'TaskCompaniesAndProjectsResource',
  () => `v4/task/companies-and-projects`
)
