const logger = require('../../config/logger')
const serviceDependencies = require('./serviceDependencies')

function pingdomTemplate (statusMessage) {
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <pingdom_http_custom_check>
      <status>${statusMessage}</status>
    </pingdom_http_custom_check>
  `.trim()
}

function healthCheckFailuresOnly (allDependencies) {
  const failureDependencies = allDependencies.filter((dependency) => (!dependency.warningOnly))
  const promiseArray = failureDependencies.map((dependency) => {
    return dependency.healthCheck()
      .then((result) => result)
      .catch((error) => {
        return { name: dependency.name, error }
      })
  })

  return Promise.all(promiseArray)
}

function healthCheckWarningsOnly (allDependencies) {
  const failureDependencies = allDependencies.filter((dependency) => (dependency.warningOnly))
  const promiseArray = failureDependencies.map((dependency) => {
    return dependency.healthCheck()
      .then((result) => result)
      .catch((error) => {
        return { name: dependency.name, error }
      })
  })

  return Promise.all(promiseArray)
}

function renderPingdomXml (req, res, next) {
  return healthCheckFailuresOnly(serviceDependencies)
    .then((results) => {
      return results.filter((result) => result.statusText !== 'OK')
    })
    .then((errors) => {
      res.set({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })

      if (errors.length) {
        errors.forEach((dependency) => {
          logger.error(`${dependency.name} health check failed`, dependency.error)
        })

        return res
          .status(503)
          .send(pingdomTemplate('Service Unavailable'))
      }

      return res
        .status(200)
        .send(pingdomTemplate('OK'))
    })
    .catch(next)
}

function renderPingdomWarningXml (req, res, next) {
  return healthCheckWarningsOnly(serviceDependencies)
    .then((results) => {
      return results.filter((result) => result.statusText !== 'OK')
    })
    .then((errors) => {
      res.set({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })

      if (errors.length) {
        errors.forEach((dependency) => {
          logger.error(`${dependency.name} health check failed`, dependency.error)
        })

        return res
          .status(503)
          .send(pingdomTemplate('Service Unavailable'))
      }

      return res
        .status(200)
        .send(pingdomTemplate('OK'))
    })
    .catch(next)
}

function getMicroserviceHealthcheck (req, res, next) {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  return res
    .status(200)
    .send('OK')
}

module.exports = {
  getMicroserviceHealthcheck,
  renderPingdomXml,
  renderPingdomWarningXml,
}
