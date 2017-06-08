const router = require('express').Router()
const { get } = require('lodash')

const { getProjectDetails } = require('./middleware')

function detailsGetHandler (req, res, next) {
  if (get(res, 'locals.investmentProject')) {
    return res.render('investment/details', {
      currentNavItem: 'details',
    })
  }
  return next()
}

function redirectToDetails (req, res) {
  res.redirect(`/investment/${req.params.id}/details`)
}

router.param('id', getProjectDetails)
router.get('/:id', redirectToDetails)
router.get('/:id/details', detailsGetHandler)

module.exports = {
  router,
  redirectToDetails,
  detailsGetHandler,
}
