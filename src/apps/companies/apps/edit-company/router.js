const router = require('express').Router()

const {
  renderEditCompanyForm,
  postEditCompany,
} = require('./controllers')

router.get('/', renderEditCompanyForm)
router.post('/', postEditCompany)

module.exports = router
