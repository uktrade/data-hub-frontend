import { apiProxyAxios } from '../../../../../components/Task/utils'
import { UNITED_KINGDOM_ID } from '../../../../../../common/constants'
import { transformResponseToCompanyCollection } from './transformers'

export const getUkCompanies = ({
  limit = 10,
  page,
  headquarter_type,
  name,
  sector_descends,
  uk_postcode,
  uk_region,
  export_to_countries,
  future_interest_countries,
  latest_interaction_date_before,
  latest_interaction_date_after,
  one_list_group_global_account_manager,
  export_segment,
  export_sub_segment,
  sortby = 'modified_on:desc',
  projectId,
}) => {
  const offset = limit * (parseInt(page, 10) - 1) || 0
  return apiProxyAxios
    .post('/v4/search/company', {
      limit,
      offset,
      headquarter_type,
      name,
      sector_descends,
      country: UNITED_KINGDOM_ID,
      uk_postcode,
      uk_region,
      archived: false,
      export_to_countries,
      future_interest_countries,
      latest_interaction_date_before,
      latest_interaction_date_after,
      one_list_group_global_account_manager,
      export_segment,
      export_sub_segment,
      sortby,
    })
    .then(({ data }) => transformResponseToCompanyCollection(projectId, data))
}

export const updateRecipientCompany = (values) =>
  apiProxyAxios.patch(`v3/investment/${values.projectId}`, {
    uk_company: values.companyId ? values.companyId : null,
  })
