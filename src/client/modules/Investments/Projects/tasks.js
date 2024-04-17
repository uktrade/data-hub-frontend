import { apiProxyAxios } from '../../../components/Task/utils'
import { getMetadataOptions } from '../../../metadata'
import { transformLandDateFilters } from './landDateTransformer'
import { metadata } from '../../../../lib/urls'

export const updateInvestmentProject = (values) =>
  apiProxyAxios.patch(`v3/investment/${values.id}`, values)

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export const getProjects = ({ limit = 10, page, companyId, ...rest }) => {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  const transformedRest = transformLandDateFilters(rest)
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      offset,
      ...(companyId && {
        investor_company: [companyId],
      }),
      ...transformedRest,
    })
    .then(({ data }) => ({
      count: data.count,
      results: data.results,
    }))
}

export const getProjectMetadata = () =>
  Promise.all([
    getMetadataOptions(metadata.country()),
    getMetadataOptions(metadata.investmentType()),
    getMetadataOptions(metadata.likelihoodToLand()),
    getMetadataOptions(metadata.investmentProjectStage()),
    getMetadataOptions(metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getMetadataOptions(metadata.ukRegion(), { filterDisabled: false }),
  ])
    .then(
      ([
        countryOptions,
        investmentTypeOptions,
        likelihoodToLandOptions,
        projectStageOptions,
        sectorOptions,
        ukRegionOptions,
      ]) => ({
        countryOptions,
        investmentTypeOptions,
        likelihoodToLandOptions,
        projectStageOptions,
        sectorOptions,
        ukRegionOptions,
      })
    )
    .catch(handleError)

export const getInvestmentProject = (id) =>
  apiProxyAxios.get(`v3/investment/${id}`).then(({ data }) => data)

export const completeInvestmentProposition = (values) =>
  apiProxyAxios.post(
    `v3/investment/${values.investmentProjectId}/proposition/${values.propositionId}/complete`,
    values
  )
export const completeInvestmentPropositions = (values) =>
  apiProxyAxios
    .post(
      `v3/investment/${values.investmentProjectId}/proposition/${values.propositionId}/complete`
    )
    .then(({ data }) => data)

export const updateProjectStage = ({ values, projectId }) =>
  apiProxyAxios.post(`/v3/investment/${projectId}/update-stage`, {
    stage: { id: values.projectStageId },
  })
