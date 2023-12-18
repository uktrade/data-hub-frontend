const { get } = require('lodash')

function renderQuote(req, res) {
  const orderStatus = get(res.locals, 'order.status')
  const heading = `Quote${orderStatus === 'draft' ? ' preview' : ''}`

  res.breadcrumb(heading).render('omis/apps/view/views/quote')
}

module.exports = {
  renderQuote,
}
