const shortId = require('shortid')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const randomCompanyName = `TestingNewCompany-1206-1`
  const firstName = shortId.generate()
  const lastName = shortId.generate()

  When(/^I navigate to Contacts page of any company$/, async () => {
    await Company
      .navigate()
      .findCompany(randomCompanyName)
    await Contact
      .navigateToContactsPage()
  })

  Then(/^I verify an option to add a new contact$/, async () => {
    await Contact
      .verify.visible('@addContactButton')
  })

  When(/^I add a new Primary Contact$/, async () => {
    await Company
      .navigate()
      .findCompany(randomCompanyName)
    await Contact
      .navigateToContactsPage()
      .createNewPrimaryContact(firstName, lastName)
  })

  When(/^I add a new non Primary Contact$/, async () => {
    await Company
      .navigate()
      .findCompany(randomCompanyName)
    await Contact
      .navigateToContactsPage()
      .createNewNonPrimaryContact(firstName, lastName)
  })

  When(/^I add a new Primary Contact with a new company address$/, async () => {
    await Company
      .navigate()
      .findCompany(randomCompanyName)
    await Contact
      .navigateToContactsPage()
      .createNewPrimaryContactWithNewCompanyAddress(firstName, lastName)
  })

  Then(/^I verify my newly added contact under search landing page$/, async () => {
    await Company
      .navigate()
    await Contact
      .getText('@contactUnderSearchPage', (result) => {
        Contact.assert.equal(result.value, `${firstName} ${lastName} from ${randomCompanyName}`)
      })
  })

  Then(/^I verify my newly added contact in company profile$/, async () => {
    await Company
      .navigate()
      .findCompany(randomCompanyName)
    await Contact
      .navigateToContactsPage()
      .getText('@contactFullname', (result) => {
        Contact.assert.equal(result.value, `${firstName} ${lastName}`)
      })
  })
})
