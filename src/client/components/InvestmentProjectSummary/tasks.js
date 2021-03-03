import { apiProxyAxios } from '../Task/utils'
import { investmentSummaryAsDataRanges } from './utils'

export const fetchInvestmentSummaryDataRanges = ({ adviser }) =>
  apiProxyAxios
    .get(`/v4/adviser/${adviser.id}/investment-summary`)
    .then(({ data }) => investmentSummaryAsDataRanges(data))
