const { get } = require('lodash')

function renderQuote(req, res) {
  const orderStatus = get(res.locals, 'order.status')
  const heading = `Quote${orderStatus === 'draft' ? ' preview' : ''}`

  res.breadcrumb(heading).render('omis/apps/view/views/quote')
}

function renderPaymentReceipt(req, res) {
  const { id } = get(res.locals, 'order')
  const { payments } = res.locals

  if (!payments || payments.length === 0) {
    return res.redirect(`/omis/${id}`)
  }

  res
    .breadcrumb('Payment receipt')
    .render('omis/apps/view/views/payment-receipt')
}

module.exports = {
  renderQuote,
  renderPaymentReceipt,
}
