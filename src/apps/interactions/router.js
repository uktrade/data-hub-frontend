const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { getInteractionCollection } = require('./middleware/collection')
const {
  postDetails,
  getInteractionDetails,
  getInteractionTypeAndService,
  getCompanyDetails,
  getAdviserDetails,
} = require('../interactions/middleware/details')
const { renderCreatePage, postAddStep1, renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { renderInteractionList } = require('./controllers/list')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', getInteractionDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getInteractionCollection, renderInteractionList)

router
  .route(/^\/create(\/1)?$/)
  .post(postAddStep1)
  .all(renderCreatePage)

router.route(['/create/2', '/:interactionId/edit'])
  .post(
    postDetails,
    renderEditPage,
  )
  .get(
    async function (req, res, next) {
      // set company
      const companyRepo = require('../companies/repos')
      res.locals.company = await companyRepo.getDitCompany(req.session.token, req.query.company)

      // set return link
      res.locals.returnLink = `/companies/${req.query.company}/interactions`
      next()
    },
    getAdviserDetails,
    getCompanyDetails,
    getInteractionTypeAndService,
    renderEditPage
  )

router.get('/:interactionId', renderDetailsPage)

module.exports = router
