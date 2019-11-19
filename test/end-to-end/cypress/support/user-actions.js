import selectors from '../../../selectors'

const createContact = data => {
  cy.get(selectors.companyContact.name).type(data.name)
  cy.get(selectors.companyContact.lastName).type(data.lastName)
  cy.get(selectors.companyContact.jobTitle).type(data.jobTitle)
  cy.get(selectors.companyContact.primaryContactYes).click()
  cy.get(selectors.companyContact.countryCode).type(data.countryCode)
  cy.get(selectors.companyContact.phone).type(data.phone)
  cy.get(selectors.companyContact.email).type(data.email)
  cy.get(selectors.companyContact.sameCompanyAddressYes).click()
  cy.get(selectors.companyForm.save).click()
}

export { createContact }
