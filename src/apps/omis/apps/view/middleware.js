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

async function cancelQuote (req, res, next) {
  try {
    await Order.cancelQuote(req.session.token, res.locals.order.id)

    req.flash('success', 'Quote successfully cancelled.')
    res.redirect(`/omis/${res.locals.order.id}`)
  } catch (error) {
    if (error.statusCode === 404) {
      req.flash('error', 'The quote does not exist so could not be cancelled.')
      return res.redirect(`/omis/${res.locals.order.id}/quote`)
    }

    if (error.statusCode === 409) {
      req.flash('error', 'Quote could not be cancelled. It has already been accepted.')
      return res.redirect(`/omis/${res.locals.order.id}/quote`)
    }

    next(error)
  }
}

function setQuoteForm (req, res, next) {
  const quote = res.locals.quote
  const orderId = res.locals.order.id
  const form = {
    buttonText: 'Generate and send quote',
    returnText: 'Return to order',
    returnLink: `/omis/${orderId}`,
  }

  if (quote.expires_on) {
    form.action = `/omis/${orderId}/quote/cancel`
    form.buttonText = 'Cancel quote'
    form.buttonModifiers = 'button-secondary'

    if (quote.accepted_on || quote.cancelled_on) {
      form.disableFormAction = true
    }

    if (new Date(quote.expires_on) > new Date()) {
      form.buttonModifiers = 'button--destructive'

      res.locals.destructive = true
    }
  }

  res.locals.quoteForm = form
  next()
}

module.exports = {
  setOrderBreadcrumb,
  getQuote,
  generateQuote,
  cancelQuote,
  setQuoteForm,
}
