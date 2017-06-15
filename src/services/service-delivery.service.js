/* eslint camelcase: 0 */
const Q = require('q')
const logger = require('../../config/logger')
const companyRepository = require('../repos/company.repo')
const contactRepository = require('../repos/contact.repo')
const metadataRepository = require('../repos/metadata.repo')
const serviceDeliveryRepository = require('../repos/service-delivery.repo')
const adviserRepository = require('../repos/adviser.repo')

function validKey (object, key) {
  return object && object[key] && object[key].data && object[key].data.id && object[key].data.id.length > 0
}

function getHydratedServiceDelivery (token, serviceDeliveryId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const sourceServiceDelivery = yield serviceDeliveryRepository.getServiceDelivery(token, serviceDeliveryId)
        const serviceDelivery = sourceServiceDelivery.attributes
        serviceDelivery.id = serviceDeliveryId
        const related = sourceServiceDelivery.relationships
        if (validKey(related, 'company')) {
          serviceDelivery.company = yield companyRepository.getDitCompany(token, related.company.data.id)
        }
        if (validKey(related, 'contact')) {
          serviceDelivery.contact = yield contactRepository.getContact(token, related.contact.data.id)
        }
        if (validKey(related, 'event')) {
          serviceDelivery.event = yield metadataRepository.getMetadataItem('event', related.event.data.id)
        }
        if (validKey(related, 'service')) {
          serviceDelivery.service = yield metadataRepository.getMetadataItem('service', related.service.data.id)
        }
        if (validKey(related, 'dit_adviser')) {
          serviceDelivery.dit_adviser = yield adviserRepository.getAdviser(token, related.dit_adviser.data.id)
        }
        if (validKey(related, 'dit_team')) {
          serviceDelivery.dit_team = yield metadataRepository.getMetadataItem('team', related.dit_team.data.id)
        }
        if (validKey(related, 'status')) {
          serviceDelivery.status = yield metadataRepository.getMetadataItem('service-delivery-status', related.status.data.id)
        }
        if (validKey(related, 'uk_region')) {
          serviceDelivery.uk_region = yield metadataRepository.getMetadataItem('uk-region', related.uk_region.data.id)
        }
        if (validKey(related, 'sector')) {
          serviceDelivery.sector = yield metadataRepository.getMetadataItem('sector', related.sector.data.id)
        }
        if (validKey(related, 'country_of_interest')) {
          serviceDelivery.country_of_interest = yield metadataRepository.getMetadataItem('country', related.country_of_interest.data.id)
        }
        resolve(serviceDelivery)
      } catch (error) {
        reject(error)
      }
    })
  })
}

// Change this to do the saving
function convertServiceDeliveryFormToApiFormat (serviceDeliveryForm) {
  let serviceDelivery = {
    data: {
      type: 'ServiceDelivery',
      attributes: {
        subject: serviceDeliveryForm.subject,
        notes: serviceDeliveryForm.notes,
        date: serviceDeliveryForm.date,
      },
      relationships: {
        company: { data: { type: 'Company', id: serviceDeliveryForm.company } },
        dit_team: { data: { type: 'Team', id: serviceDeliveryForm.dit_team } },
        service: { data: { type: 'Service', id: serviceDeliveryForm.service } },
        status: { data: { type: 'ServiceDeliveryStatus', id: serviceDeliveryForm.status } },
        contact: { data: { type: 'Contact', id: serviceDeliveryForm.contact } },
        dit_adviser: { data: { type: 'Adviser', id: serviceDeliveryForm.dit_adviser } },
        uk_region: { data: { type: 'UKRegion', id: serviceDeliveryForm.uk_region } },
        sector: { data: { type: 'Sector', id: serviceDeliveryForm.sector } },
        country_of_interest: { data: { type: 'Country', id: serviceDeliveryForm.country_of_interest } },
      },
    },
  }

  if (serviceDeliveryForm.id && serviceDeliveryForm.id.length > 0) {
    serviceDelivery.data.id = serviceDeliveryForm.id
  }
  // Only include event in the object if present
  if (serviceDeliveryForm.event) {
    serviceDelivery.data.relationships.event = { data: { type: 'Event', id: serviceDeliveryForm.event } }
  }
  return serviceDelivery
}

function createBlankServiceDeliveryForContact (token, dit_adviser, contactId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const contact = yield contactRepository.getContact(token, contactId)
        const company = yield companyRepository.getDitCompany(token, contact.company.id)

        resolve({
          contact,
          company,
          dit_adviser,
          date: new Date(),
          dit_team: {
            id: null,
            name: null,
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

function createBlankServiceDeliveryForCompany (token, dit_adviser, companyId) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const company = yield companyRepository.getDitCompany(token, companyId)
        resolve({
          company,
          dit_adviser,
          date: new Date(),
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

function convertFormBodyBackToServiceDelivery (token, flatServiceDelivery) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const company = yield companyRepository.getDitCompany(token, flatServiceDelivery.company)

        const result = {
          company,
          subject: flatServiceDelivery.subject,
          notes: flatServiceDelivery.notes,
          date: flatServiceDelivery.date,
          service: { id: flatServiceDelivery.service },
          event: { id: flatServiceDelivery.event },
          dit_team: { id: flatServiceDelivery.dit_team },
          status: { id: flatServiceDelivery.status },
          uk_region: { id: flatServiceDelivery.uk_region },
          sector: { id: flatServiceDelivery.sector },
          country_of_interest: { id: flatServiceDelivery.country_of_interest },
        }

        if (flatServiceDelivery.contact) {
          result.contact = yield contactRepository.getContact(token, flatServiceDelivery.contact)
        } else {
          result.contact = { id: null }
        }

        if (flatServiceDelivery.dit_adviser) {
          result.dit_adviser = yield adviserRepository.getAdviser(token, flatServiceDelivery.dit_adviser)
        } else {
          result.dit_adviser = { id: null }
        }

        if (flatServiceDelivery.id) {
          result.id = flatServiceDelivery.id
        }
        resolve(result)
      } catch (error) {
        logger.error(error)
        reject(error)
      }
    })
  })
}

module.exports = {
  getHydratedServiceDelivery,
  convertServiceDeliveryFormToApiFormat,
  createBlankServiceDeliveryForContact,
  createBlankServiceDeliveryForCompany,
  convertFormBodyBackToServiceDelivery,
}
