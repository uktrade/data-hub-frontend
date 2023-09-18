import { apiProxyAxios } from '../../../components/Task/utils'
import { transformLandDateFilters } from '../../../../apps/investments/client/projects/transformers'
import {
  transformNonFdiResponseToCollection,
  transformResponseToCompanyCollection,
} from './transformers'
import { UNITED_KINGDOM_ID } from '../../../../common/constants'
import { validateTeamAdvisersAreUnique } from './validator'

export const updateInvestmentProject = (values) =>
  apiProxyAxios.patch(`v3/investment/${values.id}`, values)

export const getNonFdiProjects = ({ limit = 10, page, ...rest }) => {
  const offset = limit * (parseInt(page, 10) - 1) || 0
  const transformedRest = transformLandDateFilters(rest)
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      offset,
      investment_type: '9c364e64-2b28-401b-b2df-50e08b0bca44',
      ...transformedRest,
    })
    .then(({ data }) =>
      transformNonFdiResponseToCollection(data, rest.projectId)
    )
}

export const updateAssociatedProject = (values) => {
  return apiProxyAxios.patch(`v3/investment/${values.projectId}`, {
    associated_non_fdi_r_and_d_project: values.associatedProjectId
      ? values.associatedProjectId
      : null,
  })
}

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

export const updateTeamMembers = ({ teamMembers, id }) => {
  return new Promise(async (resolve, reject) => {
    const reasonAdvisersAreNotUnique =
      validateTeamAdvisersAreUnique(teamMembers)
    if (reasonAdvisersAreNotUnique) {
      reject(reasonAdvisersAreNotUnique)
    } else {
      const url = `v3/investment/${id}/team-member`
      const response = await apiProxyAxios.put(url, teamMembers)
      resolve(response)
    }
  })
}

export const deleteProjectDocument = (values) => {
  const options = {
    url: `v3/investment/${values.projectId}/evidence-document/${values.documentId}`,
    method: 'DELETE',
  }
  return apiProxyAxios(options)
}
