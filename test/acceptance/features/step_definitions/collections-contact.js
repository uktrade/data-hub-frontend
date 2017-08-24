const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const contactCollections = client.page.CollectionsContact()
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

  Given(/^I create a new company$/, async () => {
    firstName = faker.name.firstName()
    lastName = faker.name.lastName()
    await Company
      .navigate()
    await Contact
      .navigateToContactsPage()
      .createNewPrimaryContactWithNewCompanyAddress(firstName, lastName)
    await contactCollections
  })

  When(/^I search for this Contact name$/, async () => {
    await Company
      .navigate()
      .findCompany(`${firstName} ${lastName}`)
  })

  Then(/^I view a contacts tab$/, async () => {
    await contactCollections
      .verify.visible('@contactsTab')
  })

  When(/^I click on contacts tab$/, async () => {
    await contactCollections
      .clickOnContactsTab()
  })

  Then(/^I see first and last name of the contact$/, async () => {
    await Contact
    .verify.containsText('@firstCompanyFromList', `${firstName} ${lastName}`)
  })

  Then(/^I see Company name of the contact$/, async () => {
    await contactCollections
      .verify.containsText('@companyFromFirstList', foreignCompanyName)
  })

  Then(/^I see Sector of the contact$/, async () => {
  })

  Then(/^I see Country of the contact$/, async () => {
  })

  Then(/^I see a time stamp of the contact$/, async () => {
  })

  Then(/^I see Primary or not status of the contact$/, async () => {
  })

  When(/^I search for a given Contact name$/, async () => {
  })

  When(/^I navigate to contacts tab$/, async () => {
  })

  When(/^I click on the first contact collection link$/, async () => {
  })

  Then(/^I navigate to his contact details page$/, async () => {
  })
})
