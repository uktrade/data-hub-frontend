import { createEntityResource } from '.'

export default createEntityResource(
  'CompanyOneListTeam',
  (id) => `v4/company/${id}/one-list-group-core-team`
)
