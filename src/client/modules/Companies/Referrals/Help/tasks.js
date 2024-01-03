const axios = require('axios')

const transformReferralDetails = require('../../../../../apps/companies/apps/referrals/transformer')

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const fetchReferralDetails = (id) =>
  axios
    .get(`/api-proxy/v4/company-referral/${id}`)
    .catch(handleError)
    .then(({ data }) => transformReferralDetails(data))
