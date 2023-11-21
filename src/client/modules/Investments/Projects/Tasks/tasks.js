import { apiProxyAxios } from '../../../../components/Task/utils'
import { transformFormValuesForAPI } from './transformers'

export const saveInvestmentProjectTask = ({
  values,
  investmentProject,
  currentAdviserId,
}) =>
  apiProxyAxios.post(
    '/v4/task',
    transformFormValuesForAPI(values, investmentProject, currentAdviserId)
  )
