const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const contactList = client.page.ContactList()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const foreignCompanyName = 'Lambda plc'
  let firstName
  let lastName

  Given(/^I create a new contact$/, async () => {
    firstName = faker.name.firstName()
    lastName = faker.name.lastName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .navigateToContactsPage()
      .createNewPrimaryContactWithNewCompanyAddress(firstName, lastName)
  })

  When(/^I search for this Contact name$/, async () => {
    await Company
      .navigate()
      .findCompany(`${Contact.firstname} ${Contact.lastname}`)
  })

  When(/^I click on contacts tab$/, async () => {
    await contactList
      .click('@contactsTab')
  })

  When(/^I click on the first contact collection link$/, async () => {
    await Contact
      .click('@firstCompanyFromList')
  })
})
