const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { getInteractionCollection } = require('./middleware/collection')
const {
  postDetails,
  getInteractionDetails,
  getServices,
  getCompanyDetails,
  getAdviserDetails,
} = require('../interactions/middleware/details')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { renderInteractionList } = require('./controllers/list')
const { renderCreate, postCreate } = require('./controllers/create')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', getInteractionDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getInteractionCollection, renderInteractionList)

router
  .route('/create')
  .post(postCreate)
  .all(renderCreate)

router.route(['/create/interaction', '/:interactionId/edit'])
  .post(
    postDetails,
    renderEditPage,
  )
  .get(
    async function (req, res, next) {
      // set company
      if (req.query.company) {
        const companyRepo = require('../companies/repos')
        res.locals.company = await companyRepo.getDitCompany(req.session.token, req.query.company)
        res.locals.returnLink = `/companies/${req.query.company}/interactions`
      } else if (req.query.contact) {
        const contactRepo = require('../contacts/repos')
        const contact = await contactRepo.getContact(req.session.token, req.query.contact)
        res.locals.company = contact.company
        res.locals.returnLink = `/contacts/${req.query.contact}/interactions`
      } else {
        const interactionRepo = require('../interactions/repos')
        const interaction = await interactionRepo.fetchInteraction(req.session.token, req.params.interactionId)
        res.locals.company = interaction.company
        res.locals.returnLink = `/interactions/${req.params.interactionId}`
      }
      next()
    },
    getAdviserDetails,
    getCompanyDetails,
    getServices,
    renderEditPage
  )

router.get('/:interactionId', renderDetailsPage)

module.exports = router
