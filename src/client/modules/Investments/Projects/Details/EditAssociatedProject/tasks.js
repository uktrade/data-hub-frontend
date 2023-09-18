import { apiProxyAxios } from '../../../../../components/Task/utils'
import { transformLandDateFilters } from '../../../../../../apps/investments/client/projects/transformers'
import { transformNonFdiResponseToCollection } from './transformers'

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
