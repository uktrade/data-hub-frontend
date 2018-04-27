const { adviserSearch } = require('../../adviser/repos')
const { fetchEvent } = require('../../events/repos')
const { transformAdviserToOption } = require('../../adviser/transformers')
const { transformEventToOption } = require('../../events/transformers')

async function getEntityOptionsHandler (req, res, next) {
  try {
    const token = req.session.token
    const term = req.query.term
    const entity = req.params.entity

    switch (entity) {
      case 'adviser':
        const advisers = await adviserSearch(token, term)
        res.json(advisers.map(transformAdviserToOption))
        break
      case 'event':
        const event = await fetchEvent(token, term)
        res.json(transformEventToOption(event))
        break
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getEntityOptionsHandler,
}
