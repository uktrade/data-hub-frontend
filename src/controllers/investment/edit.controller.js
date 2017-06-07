const router = require('express').Router()

const { getProjectDetails, populateFormMiddleware, postFormMiddleware } = require('./shared')

function getHandler (req, res) {
  res.render('investment/edit', {
    currentNavItem: 'details',
    variant: 'edit',
  })
}

function postHandler (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment/edit', {
      currentNavItem: 'details',
      variant: 'edit',
    })
  }
  return res.redirect(`/investment/${res.locals.resultId}`)
}

router.param('id', getProjectDetails)
router.get('/:id/details/edit', populateFormMiddleware, getHandler)
router.post('/:id/details/edit', populateFormMiddleware, postFormMiddleware, postHandler)

module.exports = {
  router,
}
