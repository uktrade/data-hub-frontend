const { setHomeBreadcrumb } = require('../../../middleware')
const { Order } = require('../../models')

function setOrderBreadcrumb (req, res, next) {
  const order = res.locals.order

  return setHomeBreadcrumb(order.reference)(req, res, next)
}

async function getQuote (req, res, next) {
  try {
    res.locals.quote = await Order.getQuote(req.session.token, res.locals.order.id)
    next()
  } catch (error) {
    if (error.statusCode === 404) {
      res.locals.quote = {}
      return next()
    }

    next(error)
  }
}

async function generateQuote (req, res, next) {
  const orderId = res.locals.order.id

  try {
    await Order.createQuote(req.session.token, orderId)

    req.flash('success', 'Quote successfully generated.')
    res.redirect(`/omis/${orderId}`)
  } catch (error) {
    const errorCode = error.statusCode

    if (errorCode === 400) {
      req.flash('error', 'Quote could not be generated. Some fields were missing.')
      return res.redirect(`/omis/${orderId}`)
    }

    if (errorCode === 409) {
      req.flash('error', 'Quote could not be generated. A valid quote already exists.')
      return res.redirect(`/omis/${orderId}`)
    }
    next(error)
  }
}

function setQuoteForm (req, res, next) {
  res.locals.quoteForm = {
    disableFormAction: false,
    buttonText: 'Generate and send quote',
    returnText: 'Return to order',
    returnLink: `/omis/${res.locals.order.id}`,
  }
  next()
}

module.exports = {
  setOrderBreadcrumb,
  getQuote,
  generateQuote,
  setQuoteForm,
}
