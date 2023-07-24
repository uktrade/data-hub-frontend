import { createEntityResource } from './Resource'

export default createEntityResource(
  'RelatedCompaniesCount',
  (id) =>
    `v4/dnb/${id}/related-companies/count?include_manually_linked_companies=true`
)
