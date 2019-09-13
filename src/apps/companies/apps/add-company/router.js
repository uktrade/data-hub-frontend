const router = require('express').Router()

const {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
  postAddDnbCompanyInvestigation,
} = require('./controllers')

router
  .route('/')
  .get(renderAddCompanyForm)
  .post(postAddDnbCompany)

router.post('/dnb/company-search', postSearchDnbCompanies)

router.post('/dnb/company-investigation', postAddDnbCompanyInvestigation)

module.exports = router
