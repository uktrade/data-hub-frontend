const router = require('express').Router()

const { getLocalNavMiddleware } = require('./shared.middleware')
const startController = require('./start.controller')
const createController = require('./create.controller')
const detailsController = require('./details.controller')
const editController = require('./edit.controller')
const auditController = require('./audit.controller')
const teamController = require('./team.controller')
const interactionsController = require('./interaction/index.controller')
const createInteractionController = require('./interaction/create.controller')
const editInteractionController = require('./interaction/edit.controller')

function handleEmptyMiddleware (req, res, next) {
  if (req.path === '/') {
    return res.redirect(`/investment/start`)
  }
  next()
}

router.use(
  '/investment',
  handleEmptyMiddleware,
  getLocalNavMiddleware,
  startController.router,
  createController.router,
  detailsController.router,
  editController.router,
  auditController.router,
  teamController.router,
  interactionsController.router,
  createInteractionController.router,
  editInteractionController.router
)

module.exports = {
  router,
  handleEmptyMiddleware,
}
