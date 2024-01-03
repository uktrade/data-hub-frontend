import { apiProxyAxios } from '../../../components/Task/utils'

export const getDnbFamilyTree = ({ companyId }) =>
  apiProxyAxios.get(`/v4/dnb/${companyId}/family-tree`).then(({ data }) => data)
