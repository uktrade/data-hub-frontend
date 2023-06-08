import urls from '../../../../lib/urls'

import {
  transformResponseToCollection,
  filterServiceNames,
} from './transformers'

import { getMetadataOptions } from '../../../metadata'
import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const sortServiceOptions = (options) =>
  options.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))

const getCompanyActivitiesMetadata = () =>
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

const getCompanyActivities = ({
  size = 10,
  page = 1,
  subject,
  activityType,
  activity,
  ditParticipantsAdviser,
  showDnbHierarchy,
  company,
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
    .get(`/companies/${company?.id}/activity/data`, {
      params: {
        size,
        from: parseInt(size * (page - 1), 0),
        subject,
        activityType,
        activity,
        ditParticipantsAdviser,
        showDnbHierarchy,
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
      },
    })
    .then(({ data }) => transformResponseToCollection(data))

export { getCompanyActivities, getCompanyActivitiesMetadata }
