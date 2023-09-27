import { apiProxyAxios } from '../../../../components/Task/utils'
import { transformFormValuesForAPI } from './transformers'

export const saveInvestmentProjectTask = ({
  values,
  investmentProject,
  currentAdviserId,
}) => {
  values.investmentProject = investmentProject
  values.currentAdviserId = currentAdviserId

  return apiProxyAxios.post(
    '/v4/investmentprojecttask',
    transformFormValuesForAPI(values, investmentProject, currentAdviserId)
  )
}
