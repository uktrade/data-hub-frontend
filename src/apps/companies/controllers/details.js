const queryString = require('qs')

async function renderDetails(req, res) {
  return res.redirect(
    301,
    `interactions${req.query ? '?' + queryString.stringify(req.query) : ''}`
  )
}

module.exports = {
  renderDetails,
}
