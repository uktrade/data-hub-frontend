const urls = require('../../../lib/urls')
const { redirectWithQueryString } = require('../../middleware')

async function renderDetails(req, res) {
  const { company } = res.locals

  return redirectWithQueryString(
    req,
    res,
    urls.companies.interactions.index(company.id)
  )
}

module.exports = {
  renderDetails,
}
