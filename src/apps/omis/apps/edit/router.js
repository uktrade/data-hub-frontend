const { get } = require('lodash')
const router = require('express').Router()

const { editRedirect, editHandler, editLeadAssignee } = require('./controllers')
const { setCompany } = require('../../middleware')

router.use((req, res, next) => {
  const orderId = get(res.locals, 'order.company.id')

  if (!orderId) {
    return next()
  }

  setCompany(req, res, next, orderId)
})

router.get('/', editRedirect)
router.all('/:step', editHandler)

router.post('/lead-assignee', editLeadAssignee)

module.exports = router
