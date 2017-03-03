const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')
const interactionRepository = require('./interactionrepository')

function getBriefContact (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/contact/${contactId}/`)
}

function getContact (token, contactId) {
  let result

  return authorisedRequest(token, `${config.apiRoot}/contact/${contactId}/`)
  .then((data) => {
    result = data
    let promises = []
    for (const interaction of result.interactions) {
      promises.push(interactionRepository.getInteraction(token, interaction.id))
    }

    return Promise.all(promises)
  })
  .then((interactions) => {
    result.interactions = interactions
    return result
  })
  .catch((error) => {
    console.log(error)
    throw (error)
  })
}

function getContactsForCompany (token, companyId) {
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/contact/?company=${companyId}`)
      .then((data) => {
        resolve(data.results)
      })
  })
}

function saveContact (token, contact) {
  let options = {
    body: contact
  }

  if (contact.address_same_as_company) {
    delete contact.address_1
    delete contact.address_2
    delete contact.address_3
    delete contact.address_4
    delete contact.address_town
    delete contact.address_county
    delete contact.address_country
    delete contact.address_postcode
  }

  if (contact.id && contact.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/contact/${contact.id}/`
    options.method = 'PUT'
  } else {
    options.url = `${config.apiRoot}/contact/`
    options.method = 'POST'
  }

  return authorisedRequest(token, options)
}

function archiveContact (token, contactId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/contact/${contactId}/archive/`,
    method: 'POST'
  }
  return authorisedRequest(token, options)
}

function unarchiveContact (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/contact/${contactId}/unarchive/`)
}

module.exports = { getContact, saveContact, getContactsForCompany, archiveContact, unarchiveContact, getBriefContact }
