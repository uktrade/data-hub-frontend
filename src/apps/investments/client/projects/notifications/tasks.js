import axios from 'axios'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export const saveNotificationSettings = ({ investment, estimated_land_date }) =>
  axios
    .post(`/api-proxy/v3/investment/${investment.id}/notification`, {
      estimated_land_date,
    })
    .catch(handleError)

export const getNotificationSettings = (investment) =>
  axios
    .get(`/api-proxy/v3/investment/${investment.id}/notification`)
    .then(({ data }) => ({
      estimatedLandDate: data.estimated_land_date,
    }))
    .catch(handleError)
