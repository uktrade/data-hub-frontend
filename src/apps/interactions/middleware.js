const { getHydratedInteraction } = require('./services/data')

async function getDetails (req, res, next) {
  try {
    const token = req.session.token
    if (req.params.interactionId && req.params.interactionId !== 'add') {
      res.locals.interaction = await getHydratedInteraction(token, req.params.interactionId)
    }
    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null
  req.body = Object.assign({}, req.body, selectedSortBy)
  next()
}

module.exports = {
  getDetails,
  getRequestBody,
}
