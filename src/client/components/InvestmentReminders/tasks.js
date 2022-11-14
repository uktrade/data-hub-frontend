import { apiProxyAxios } from '../Task/utils'

export const fetchOutstandingPropositions = async ({ adviser }) => {
  const investmentELDResponse = await apiProxyAxios.get(
    '/v4/reminder/estimated-land-date',
    {
      params: {
        adviser_id: adviser.id,
      },
    }
  )

  const investmentNRIResponse = await apiProxyAxios.get(
    '/v4/reminder/no-recent-investment-interaction',
    {
      params: {
        adviser_id: adviser.id,
      },
    }
  )

  const investmentOPResponse = await apiProxyAxios.get('/v4/proposition', {
    params: {
      adviser_id: adviser.id,
    },
  })

  const investmentELD = investmentELDResponse.data
  const investmentNRI = investmentNRIResponse.data
  const investmentOP = investmentOPResponse.data
  const count = investmentELD.count + investmentNRI.count + investmentOP.count

  return { count, investmentELD, investmentNRI, investmentOP }
}
