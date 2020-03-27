const logger = require('../../config/logger')
const serviceDependencies = require('./serviceDependencies')

const failureDependencies = serviceDependencies.filter(
  (dependency) => !dependency.warningOnly
)
const warningDependencies = serviceDependencies.filter(
  (dependency) => dependency.warningOnly
)

function pingdomTemplate(statusMessage) {
  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <pingdom_http_custom_check>
      <status>${statusMessage}</status>
    </pingdom_http_custom_check>
  `.trim()
}

function healthCheck(dependencies) {
  const promiseArray = dependencies.map((dependency) => {
    return dependency
      .healthCheck()
      .then((result) => result)
      .catch((error) => {
        return { name: dependency.name, error }
      })
  })

  return Promise.all(promiseArray)
}

function renderPingdomXml(req, res, next, dependencies) {
  return healthCheck(dependencies)
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
          logger.error(
            `${dependency.name} health check failed`,
            dependency.error
          )
        })

        return res.status(503).send(pingdomTemplate('Service Unavailable'))
      }

      return res.status(200).send(pingdomTemplate('OK'))
    })
    .catch(next)
}

function getPingdomFailures(req, res, next) {
  return renderPingdomXml(req, res, next, failureDependencies)
}

function getPingdomWarnings(req, res, next) {
  return renderPingdomXml(req, res, next, warningDependencies)
}

function getMicroserviceHealthcheck(req, res) {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  return res.status(200).send('OK')
}

module.exports = {
  getMicroserviceHealthcheck,
  getPingdomFailures,
  getPingdomWarnings,
}
