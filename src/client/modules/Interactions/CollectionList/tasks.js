import axios from 'axios'

import urls from '../../../../lib/urls'

import {
  transformResponseToCollection,
  filterServiceNames,
} from './transformers'

import { getMetadataOptions } from '../../../metadata'
import { getPageOffset } from '../../../utils/pagination'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const sortServiceOptions = (options) =>
  options.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))

const getInteractionsMetadata = () =>
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

const getInteractions = ({
  limit = 10,
  page = 1,
  kind,
  dit_participants__adviser,
  service,
  date_before,
  date_after,
  sortby = 'date:desc',
  sector_descends,
  was_policy_feedback_provided,
  policy_areas,
  policy_issue_types,
  company_one_list_group_tier,
  dit_participants__team,
}) =>
  axios
    .post('/v3/search/interaction', {
      limit,
      offset: getPageOffset({ limit, page }),
      kind,
      dit_participants__adviser,
      sortby,
      date_before,
      date_after,
      service,
      sector_descends,
      was_policy_feedback_provided,
      policy_areas,
      policy_issue_types,
      company_one_list_group_tier,
      dit_participants__team,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

export { getInteractions, getInteractionsMetadata }
