const router = require('express').Router()

const {
  getProjectDetails,
} = require('./middleware')

const {
  populateDetailsFormMiddleware,
  investmentDetailsFormPostMiddleware,
} = require('./form.middleware')

function createGetHandler (req, res) {
  if (!res.locals.equityCompany) {
    return res.redirect('/investment/start')
  }
  return res.render('investment/create')
}

function createPostHandler (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment/create')
  }
  return res.redirect(`/investment/${res.locals.resultId}`)
}

router.param('id', getProjectDetails)
router.get('/create', populateDetailsFormMiddleware, createGetHandler)
router.post('/create', populateDetailsFormMiddleware, investmentDetailsFormPostMiddleware, createPostHandler)

module.exports = {
  router,
  createGetHandler,
  createPostHandler,
}
