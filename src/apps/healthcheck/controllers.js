const logger = require('../../../config/logger')
const serviceDependencies = require('./serviceDependencies')

function healthCheck (dependencies) {
  const promiseArray = dependencies.map((dependency) => {
    return dependency.healthCheck()
      .then((result) => result)
      .catch((error) => {
        return { name: dependency.name, error }
      })
  })

  return Promise.all(promiseArray)
}

function getHandler (req, res, next) {
  return healthCheck(serviceDependencies)
    .then((results) => results.filter((result) => result.statusText !== 'OK'))
    .then((errors) => {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate')

      if (errors.length) {
        errors.forEach((dependency) => {
          logger.error(`${dependency.name} health check failed`, dependency.error)
        })

        return res.status(503).send('Service Unavailable')
      }

      return res.status(200).send('OK')
    })
    .catch(next)
}

module.exports = {
  getHandler,
}
