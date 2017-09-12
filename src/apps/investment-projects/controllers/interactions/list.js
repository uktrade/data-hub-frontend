const { get } = require('lodash')

async function indexGetHandler (req, res, next) {
  try {
    if (get(res, 'locals.investmentData')) {
      return res
        .breadcrumb('Interactions')
        .render('investment-projects/views/interactions/index')
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  indexGetHandler,
}
