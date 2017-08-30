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

  Given(/^I create a new contact with same address as company$/, async () => {
    firstName = faker.name.firstName()
    lastName = faker.name.lastName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .navigateToContactsPage()
      .createNewPrimaryContact(firstName, lastName)
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
      .click('@contactsTab')
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
    await contactCollections
      .verify.containsText('@sectorFromFirstList', 'Oil and Gas')
  })

  Then(/^I see Country of the contact$/, async () => {
    await contactCollections
      .verify.containsText('@countryFromFirstList', 'United Kingdom')
  })

  Then(/^I see Country of the contact same as the company$/, async () => {
    await contactCollections
      .verify.containsText('@countryFromFirstList', 'France')
  })

  Then(/^I see a time stamp of the contact$/, async () => {
    var currentdate = new Date()
    var datetime = currentdate.getDate() + '/' +
                (('0' + (currentdate.getMonth() + 1)).slice(-2)) + '/' +
                currentdate.getFullYear() + ', ' +
                (currentdate.getHours() - 1) + ':' +
                ('0' + (currentdate.getMinutes())).slice(-2)
    await contactCollections
      .verify.containsText('@createdDateFromFirstList', datetime)
  })

  Then(/^I see Primary or not status of the contact$/, async () => {
    await contactCollections
      .verify.containsText('@primaryFromFirstList', `Primary`)
  })

  When(/^I click on the first contact collection link$/, async () => {
    await Contact
      .click('@firstCompanyFromList')
  })

  Then(/^I navigate to his contact details page$/, async () => {
    await contactCollections
      .verify.containsText('@contactFullNameFromDetailsPage', `${firstName} ${lastName}`)
  })
})
