import axios from 'axios'
import { isEmpty } from 'lodash'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export const saveEstimatedLandDate = ({ investment, estimated_land_date }) =>
  axios
    .post(`/api-proxy/v3/investment/${investment.id}/notification`, {
      estimated_land_date,
    })
    .catch(handleError)

export const getEstimatedLandDate = (investment) =>
  axios
    .get(`/api-proxy/v3/investment/${investment.id}/notification`)
    .then(({ data }) => ({
      estimatedLandDate: isEmpty(data.estimated_land_date)
        ? ['none']
        : data.estimated_land_date,
    }))
    .catch(handleError)
