const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const ContactList = client.page.ContactList()

  When(/^I navigate to contacts collection page$/, async () => {
    await Company
      .navigate()
      .findCompany('venu')
    await ContactList
      .verify.visible('@contactsTab')
      .click('@contactsTab')
    await Contact
      .click('@firstCompanyFromList')
    await ContactList
      .click('@contactsBreadcrumb')
      .verify.visible('@filterSector')
  })

  When(/^I filter the display by contacts sector$/, async () => {
    await ContactList
      .click('@filterSector')
      .click('@filterSectorList')
      .click('@sectorFromList')
  })

  Then(/^I verify the display is changed based on the given sector for contact$/, async () => {
    await ContactList
      .assert.containsText('@sectorFromList', 'Advanced Engineering')
  })

  When(/^I filter the display by country$/, async () => {
    await ContactList
      .click('@filterCountry')
      .click('@filterCountryList')
      .click('@sectorFromList')
  })

  Then(/^I verify the display is changed based on the given country$/, async () => {
    await ContactList
      .assert.containsText('@countryFromList', 'United Kingdom')
  })

  When(/^I filter the display by region$/, async () => {
    await ContactList
      .click('@filterCountry')
      .click('@filterCountryList')
      .click('@sectorFromList')
      .verify.visible('@filterRegionList')
      .click('@filterRegionList')
      .click('@filterRegionList')
      .click('@sectorFromList')
  })

  Then(/^I verify the display is changed based on the given region$/, async () => {
    await ContactList
      .assert.containsText('@countryFromList', 'United Kingdom')
  })

  When(/^I filter the display by company name$/, async () => {
    await ContactList
      .setValue('@filterCompany', 'Red')
      .click('@sectorFromList')
      .click('@countryFromList')
  })

  Then(/^I verify the display is changed based on the given company name$/, async () => {
    await ContactList
      .assert.containsText('@companyFromList', 'red')
      .assert.containsText('@companyFromSecondList', 'red')
      .assert.containsText('@companyFromThirdList', 'red')
  })
})
