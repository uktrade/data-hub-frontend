const winston = require('winston')
const authorisedRequest = require('../lib/authorised-request')
const config = require('../config')

function saveServiceDelivery (token, serviceDelivery) {
  const options = {
    body: serviceDelivery,
  }
  // v2 endpoint only supports POST
  options.method = 'POST'
  options.url = `${config.apiRoot}/v2/service-delivery/`
  return authorisedRequest(token, options)
}

function getServiceDelivery (token, serviceDeliveryId) {
  return new Promise((resolve, reject) => {
    authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/${serviceDeliveryId}/`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      winston.error(error)
      reject(error)
    })
  })
}

function getServiceDeliveriesForCompany (token, companyId) {
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/?company_id=${companyId}`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      winston.info(error)
      resolve([])
    })
  })
}

function getServiceDeliveriesForContact (token, contactId) {
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/?contact_id=${contactId}`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      winston.info(error)
      resolve([])
    })
  })
}

module.exports = {
  getServiceDelivery,
  saveServiceDelivery,
  getServiceDeliveriesForCompany,
  getServiceDeliveriesForContact,
}
