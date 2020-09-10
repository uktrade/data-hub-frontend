const { castArray } = require('lodash')

const { getAdviser } = require('../adviser/repos')

async function adviserLookup(req, res, next) {
  try {
    const adviserParam = req.query.adviser
    res.locals.advisers = []

    if (adviserParam) {
      const adviserIds = castArray(adviserParam)

      for (let index = 0; index < adviserIds.length; index += 1) {
        const adviser = await getAdviser(req, adviserIds[index])
        res.locals.advisers.push({
          value: adviser.id,
          label: adviser.name,
        })
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { adviserLookup }
