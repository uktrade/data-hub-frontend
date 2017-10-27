const faker = require('faker')
const format = require('date-fns/format')
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

  Given(/^I create a new contact with same address as company$/, async function () {
    firstName = faker.name.firstName()
    lastName = faker.name.lastName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .navigateToContactsPage()
      .createNewContact({ firstName, lastName }, true, (contact) => {
        this.state.contact = contact
      })
  })

  When(/^I search for this Contact name$/, async () => {
    await Company
      .navigate()
      .findCompany(`${Contact.firstname} ${Contact.lastname}`)
  })

  Then(/^I view a contacts tab$/, async () => {
    await contactList
      .verify.visible('@contactsTab')
  })

  When(/^I click on contacts tab$/, async () => {
    await contactList
      .click('@contactsTab')
  })

  Then(/^I see first and last name of the contact$/, async () => {
    await Contact
      .verify.containsText('@firstCompanyFromList', `${firstName} ${lastName}`)
  })

  Then(/^I see Company name of the contact$/, async () => {
    await contactList
      .verify.containsText('@companyFromFirstList', foreignCompanyName)
  })

  Then(/^I see Sector of the contact$/, async () => {
    await contactList
      .verify.containsText('@sectorFromFirstList', 'Oil and Gas')
  })

  Then(/^I see Country of the contact$/, async () => {
    await contactList
      .verify.containsText('@countryFromFirstList', 'United Kingdom')
  })

  Then(/^I see Country of the contact same as the company$/, async () => {
    await contactList
      .verify.containsText('@countryFromFirstList', 'France')
  })

  Then(/^I see a time stamp of the contact$/, async () => {
    const datetime = format(new Date(), 'D MMM YYYY')
    await contactList
      .verify.containsText('@createdDateFromFirstList', datetime)
  })

  Then(/^I see Primary or not status of the contact$/, async () => {
    await contactList
      .verify.containsText('@primaryFromFirstList', `Primary`)
  })

  When(/^I click on the first contact collection link$/, async () => {
    await Contact
      .click('@firstCompanyFromList')
  })

  Then(/^I navigate to his contact details page$/, async () => {
    await contactList
      .verify.containsText('@contactFullNameFromDetailsPage', `${firstName} ${lastName}`)
  })
})
