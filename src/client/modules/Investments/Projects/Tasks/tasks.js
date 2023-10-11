import { apiProxyAxios } from '../../../../components/Task/utils'
import {
  transformFormValuesForAPI,
  transformTaskFormValuesForAPI,
} from './transformers'

export const saveInvestmentProjectTask = ({
  values,
  investmentProject,
  currentAdviserId,
  task,
}) => {
  if (task) {
    return apiProxyAxios.patch(
      `/v4/task/${task.id}`,
      transformTaskFormValuesForAPI(values, currentAdviserId)
    )
  } else {
    return apiProxyAxios.post(
      '/v4/investmentprojecttask',
      transformFormValuesForAPI(values, investmentProject, currentAdviserId)
    )
  }
}
