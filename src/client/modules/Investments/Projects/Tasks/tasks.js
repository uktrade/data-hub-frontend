import { apiProxyAxios } from '../../../../components/Task/utils'
import { transformFormValuesForAPI } from './transformers'

export const saveInvestmentProjectTask = ({ values, investmentProject }) => {
  let request, endpoint
  request = apiProxyAxios.post
  endpoint = `/v4/investmentprojecttask`
  // let investmentName = investmentProject.name
  // let investmentId = investmentProject.id
  // values.investmentName = investmentProject.name
  // values.investmentId = investmentProject.id
  values.investmentProject = investmentProject
  return request(endpoint, transformFormValuesForAPI(values))
}
