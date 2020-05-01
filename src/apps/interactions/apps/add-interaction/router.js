const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { renderEditPage } = require('../../controllers/edit')
const { renderCreate } = require('../../controllers/create')
const { postCreate } = require('../../controllers/create')
const { renderAddInteractionForm } = require('./controllers')
const { postDetails } = require('../../middleware/details')

const featureSwitchController = (req, res, next) => {
  const { features } = res.locals

  if (features['enable-new-interaction-form']) {
    renderAddInteractionForm(req, res, next)
  } else {
    if (req.route.path === urls.interactions.subapp.create.route) {
      renderCreate(req, res, next)
    } else {
      renderEditPage(req, res, next)
    }
  }
}

router
  .route(urls.interactions.subapp.create.route)
  .post(postCreate, renderCreate)
  .get(featureSwitchController)

router
  .route(urls.interactions.subapp.createType.route)
  .post(postDetails, renderEditPage)
  .get(featureSwitchController)

module.exports = router
