const selectors = require('../../../../selectors')

const create = data => {
  cy.get(selectors.contactCreate.name).type(data.name)
  cy.get(selectors.contactCreate.lastName).type(data.lastName)
  cy.get(selectors.contactCreate.jobTitle).type(data.jobTitle)
  cy.get(selectors.contactCreate.primaryContactYes).click()
  cy.get(selectors.contactCreate.countryCode).type(data.countryCode)
  cy.get(selectors.contactCreate.phone).type(data.phone)
  cy.get(selectors.contactCreate.email).type(data.email)
  cy.get(selectors.contactCreate.sameCompanyAddressYes).click()
  cy.get(selectors.companyForm.save).click()
}

const createWithNewAddress = data => {
  cy.get(selectors.contactCreate.name).type(data.name)
  cy.get(selectors.contactCreate.lastName).type(data.lastName)
  cy.get(selectors.contactCreate.jobTitle).type(data.jobTitle)
  cy.get(selectors.contactCreate.primaryContactYes).click()
  cy.get(selectors.contactCreate.countryCode).type(data.countryCode)
  cy.get(selectors.contactCreate.phone).type(data.phone)
  cy.get(selectors.contactCreate.email).type(data.email)

  cy.get(selectors.contactCreate.sameCompanyAddressNo).click()
  cy.get(selectors.contactCreate.postCodeLookupAddress1).type(data.address1)
  cy.get(selectors.contactCreate.postCodeLookupAddress2).type(data.address2)
  cy.get(selectors.contactCreate.postCodeLookupTown).type(data.city)
  cy.get(selectors.contactCreate.postCodeLookupCountry).select(data.country)

  cy.get(selectors.companyForm.save).click()
}

module.exports = {
  create,
  createWithNewAddress,
}
