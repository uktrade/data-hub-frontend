import { apiProxyAxios } from '../../../components/Task/utils'
import { getPageOffset } from '../../../utils/pagination'
import { getMetadataOptions } from '../../../metadata'
import {
  filterServiceNames,
  transformResponseToCollection,
} from './transformers'
import urls from '../../../../lib/urls'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const sortServiceOptions = (options) =>
  options.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))

export const getCompanyActivitiesMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.service(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getMetadataOptions(urls.metadata.policyArea()),
    getMetadataOptions(urls.metadata.policyIssueType()),
    getMetadataOptions(urls.metadata.oneListTier()),
  ])
    .then(
      ([
        serviceOptions,
        sectorOptions,
        policyAreaOptions,
        policyIssueTypeOptions,
        companyOneListTierOptions,
      ]) => ({
        serviceOptions: filterServiceNames(sortServiceOptions(serviceOptions)),
        sectorOptions,
        policyAreaOptions,
        policyIssueTypeOptions,
        companyOneListTierOptions,
      })
    )
    .catch(handleError)

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
    .post(`/v4/company/${company}/activity`, {
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
    }, { params: {'limit': limit, 'offset': getPageOffset({limit, page})}})
    .then(({ data }) => transformResponseToCollection(data))
