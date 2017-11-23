const router = require('express').Router()

const { editRedirect, editHandler, editLeadAssignee } = require('./controllers')
const { setCompany, setOrderBreadcrumb } = require('../../middleware')

router.use((req, res, next) => {
  setCompany(req, res, next, res.locals.order.company.id)
})

router.use(setOrderBreadcrumb)

router.get('/', editRedirect)
router.all('/:step', editHandler)

router.post('/lead-assignee', editLeadAssignee)

module.exports = router
