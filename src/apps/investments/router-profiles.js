throw Error('Is this used?')
const router = require('express').Router()

const {
  LARGE_INVESTMENT_PROFILE_QUERY_FIELDS,
  LARGE_INVESTMENT_PROFILE_QUERY_DATE,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')

const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

router.get(
  '/export',
  getRequestBody(
    LARGE_INVESTMENT_PROFILE_QUERY_FIELDS,
    LARGE_INVESTMENT_PROFILE_QUERY_DATE
  ),
  exportCollection('large-investor-profile')
)

module.exports = router
