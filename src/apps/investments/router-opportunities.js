throw Error('Is this used?')
const router = require('express').Router()

const {
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
  LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')

const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

router.get(
  '/export',
  getRequestBody(
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_FIELDS,
    LARGE_INVESTMENT_OPPORTUNITY_QUERY_DATE
  ),
  exportCollection('large-capital-opportunity')
)

module.exports = router
