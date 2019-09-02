const router = require('express').Router()

const {
  renderAddCompanyForm,
  postSearchDnbCompanies,
} = require('./controllers')

router.get('/', renderAddCompanyForm)
router.post('/', postSearchDnbCompanies)

module.exports = router
