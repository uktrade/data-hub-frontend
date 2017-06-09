const router = require('express').Router()

const { getProjectDetails } = require('./shared.middleware')

const {
  investmentDetailsFormPostMiddleware,
  investmentValueFormPostMiddleware,
  populateDetailsFormMiddleware,
  populateValueFormMiddleware,
} = require('./form.middleware')

const templateData = {
  currentNavItem: 'details',
  variant: 'edit',
}

function editDetailsGet (req, res) {
  res.render('investment/details-edit', templateData)
}

function editValueGet (req, res) {
  res.render('investment/value-edit', templateData)
}

function editDetailsPost (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment/details-edit', templateData)
  }
  return res.redirect(`/investment/${res.locals.resultId}`)
}

function editValuePost (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment/value-edit', templateData)
  }
  return res.redirect(`/investment/${res.locals.projectId}`)
}

router.param('id', getProjectDetails)
router.get('/:id/edit-details', populateDetailsFormMiddleware, editDetailsGet)
router.get('/:id/edit-value', populateValueFormMiddleware, editValueGet)
router.post('/:id/edit-details', populateDetailsFormMiddleware, investmentDetailsFormPostMiddleware, editDetailsPost)
router.post('/:id/edit-value', populateValueFormMiddleware, investmentValueFormPostMiddleware, editValuePost)

module.exports = {
  router,
}
