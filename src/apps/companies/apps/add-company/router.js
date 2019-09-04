const router = require('express').Router()

const {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
} = require('./controllers')

router
  .route('/')
  .get(renderAddCompanyForm)
  .post(postAddDnbCompany)

router.post('/dnb/company-search', postSearchDnbCompanies)

module.exports = router
