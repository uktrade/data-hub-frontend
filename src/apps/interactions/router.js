const router = require('express').Router()

const {
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')
const { getRequestBody } = require('../../middleware/collection')

const { handleRoutePermissions } = require('../middleware')

const subAppRouter = require('./router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.get(
  '/export',
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('interaction')
)

router.get('/', (req, res, next) => {
  try {
    const { user } = req.session
    return res.render('interactions/views/interactions', {
      props: { currentAdviserId: user.id },
    })
  } catch (error) {
    next(error)
  }
})

router.use(subAppRouter)

module.exports = router
