const urls = require('../../../lib/urls')
const queryString = require('qs')
const { URL } = require('url')

async function renderDetails(req, res) {
  const { company } = res.locals

  const url = new URL(
    urls.companies.interactions.index(company.id),
    `${req.protocol}://${req.get('host')}`
  )

  url.search = new URLSearchParams(queryString.stringify(req.query))
  return res.redirect(301, url)
}

module.exports = {
  renderDetails,
}
