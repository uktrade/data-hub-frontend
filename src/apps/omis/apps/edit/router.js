const router = require('express').Router()

const { editRedirect, editHandler, editLeadAssignee } = require('./controllers')
const { getCompany } = require('../../middleware/params')

router.use((req, res, next) => {
  getCompany(req, res, next, res.locals.order.company.id)
})

router.get('/', editRedirect)
router.all('/:step', editHandler)

router.post('/lead-assignee', editLeadAssignee)

module.exports = router
