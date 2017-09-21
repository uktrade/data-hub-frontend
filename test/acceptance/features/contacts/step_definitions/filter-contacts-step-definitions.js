const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const contactCollections = client.page.CollectionsContact()

  When(/^I navigate to contacts collection page$/, async () => {
    await Company
      .navigate()
      .findCompany('venu')
    await contactCollections
      .verify.visible('@contactsTab')
      .click('@contactsTab')
    await Contact
      .click('@firstCompanyFromList')
    await contactCollections
      .click('@contactsBreadcrumb')
      .verify.visible('@filterSector')
  })

  When(/^I filter the display by contacts sector$/, async () => {
    await contactCollections
      .click('@filterSector')
      .click('@filterSectorList')
      .click('@sectorFromList')
  })

  Then(/^I verify the display is changed based on the given sector for contact$/, async () => {
    await contactCollections
      .assert.containsText('@sectorFromList', 'Advanced Engineering')
  })

  When(/^I filter the display by country$/, async () => {
    await contactCollections
      .click('@filterCountry')
      .click('@filterCountryList')
      .click('@sectorFromList')
  })

  Then(/^I verify the display is changed based on the given country$/, async () => {
    await contactCollections
      .assert.containsText('@countryFromList', 'United Kingdom')
  })

  When(/^I filter the display by region$/, async () => {
    await contactCollections
      .click('@filterCountry')
      .click('@filterCountryList')
      .click('@sectorFromList')
      .verify.visible('@filterRegionList')
      .click('@filterRegionList')
      .click('@filterRegionList')
      .click('@sectorFromList')
  })

  Then(/^I verify the display is changed based on the given region$/, async () => {
    await contactCollections
      .assert.containsText('@countryFromList', 'United Kingdom')
  })

  When(/^I filter the display by company name$/, async () => {
    await contactCollections
      .setValue('@filterCompany', 'Red')
      .click('@sectorFromList')
      .click('@countryFromList')
  })

  Then(/^I verify the display is changed based on the given company name$/, async () => {
    await contactCollections
      .assert.containsText('@companyFromList', 'red')
      .assert.containsText('@companyFromSecondList', 'red')
      .assert.containsText('@companyFromThirdList', 'red')
  })
})
