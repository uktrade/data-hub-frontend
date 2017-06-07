const router = require('express').Router()

const { populateFormMiddleware, postFormMiddleware } = require('./shared')

function getHandler (req, res) {
  if (!res.locals.equityCompany) {
    return res.redirect('/investment/start')
  }

  return res.render('investment/create')
}

function postHandler (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment/create')
  }
  return res.redirect(`/investment/${res.locals.resultId}`)
}

router.get('/create', populateFormMiddleware, getHandler)
router.post('/create', populateFormMiddleware, postFormMiddleware, postHandler)

module.exports = {
  router,
  getHandler,
  postHandler,
}
