import axios from 'axios'

import { transformResponseToCollection } from './transformers'

const getCompanyActivities = ({
  size = 10,
  page = 1,
  subject,
  activityType,
  activity,
  ditParticipantsAdviser,
  createdByOthers,
  company,
  service,
  dateBefore,
  dateAfter,
  sortby = 'date:desc',
  sector_descends,
  was_policy_feedback_provided,
  policy_areas,
  policy_issue_types,
  company_one_list_group_tier,
  dit_participants__team,
  include_parent_companies,
  include_subsidiary_companies,
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
        createdByOthers,
        sortby,
        dateBefore,
        dateAfter,
        service,
        sector_descends,
        was_policy_feedback_provided,
        policy_areas,
        policy_issue_types,
        company_one_list_group_tier,
        dit_participants__team,
        include_parent_companies,
        include_subsidiary_companies,
      },
    })
    .then(({ data }) => transformResponseToCollection(data))

export { getCompanyActivities }
