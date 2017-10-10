const { assign } = require('lodash')
const { transformInteractionFormBodyToApiRequest } = require('../transformers')
const { fetchInteraction, saveInteraction } = require('../repos')

async function postDetails (req, res, next) {
  res.locals.requestBody = transformInteractionFormBodyToApiRequest({
    props: req.body,
    company: req.query.company,
    communicationChannel: req.query.interaction_type,
  })

  try {
    const result = await saveInteraction(req.session.token, res.locals.requestBody)

    req.flash('success', `Interaction ${res.locals.interaction ? 'updated' : 'created'}`)
    return res.redirect(`/interactions/${result.id}`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: err.error,
        },
      })
      next()
    } else {
      next(err)
    }
  }
}

async function getInteractionDetails (req, res, next, interactionId) {
  try {
    res.locals.interaction = await fetchInteraction(req.session.token, interactionId)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
  postDetails,
}
