import { apiProxyAxios } from '../../../components/Task/utils'
import { getPageOffset } from '../../../utils/pagination'

import { transformResponseToCollection } from './transformers'

export const getCompanyInteractions = ({
  limit = 10,
  page = 1,
  subject,
  kind,
  dit_participants__adviser,
  company,
  service,
  date_before,
  date_after,
  sortby = 'date:desc',
  was_policy_feedback_provided,
  policy_areas,
  policy_issue_types,
  company_one_list_group_tier,
  dit_participants__team,
}) =>
  apiProxyAxios
    .post('/v3/search/interaction', {
      limit,
      offset: getPageOffset({ limit, page }),
      subject,
      kind,
      dit_participants__adviser,
      company,
      sortby,
      date_before,
      date_after,
      service,
      was_policy_feedback_provided,
      policy_areas,
      policy_issue_types,
      company_one_list_group_tier,
      dit_participants__team,
    })
    .then(({ data }) => transformResponseToCollection(data))
