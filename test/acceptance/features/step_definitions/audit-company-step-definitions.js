const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const auditContact = client.page.AuditContact()
  const auditCompany = client.page.AuditCompany()
  const foreignCompanyName = 'Venus'
  let companyName
  let description
  let website

  Given(/^I Amend a existing company record$/, async () => {
    description = faker.name.jobDescriptor()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await auditContact
      .getText('@lastContactFromList', (result) => {
        companyName = result.value
      })
      .click('@lastContactFromList')
    await auditCompany
      .editCompany(description)
  })

  Given(/^I Amend two records of an existing company record$/, async () => {
    description = faker.name.jobDescriptor()
    website = faker.internet.url()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await auditContact
      .getText('@lastContactFromList', (result) => {
        companyName = result.value
      })
      .click('@lastContactFromList')
    await auditCompany
      .editCompanyTwoRecords(description, website)
  })

  When(/^I search for this company record$/, async () => {
    await Company
      .navigate()
      .findCompany(companyName)
    await Contact
      .click('@firstCompanyFromList')
  })

  Then(/^I see the name of the person who made the recent company record changes$/, async () => {
    await auditContact
      .verify.containsText('@advisorNameFromList', 'Test CMU 1')
  })

  Then(/^I see the date time stamp when the recent company record changed$/, async () => {
    const datetime = format(new Date(), 'D MMM YYYY')
    await auditContact
      .verify.containsText('@createdDateFromFirstList', datetime)
  })

  Then(/^I see the total number of changes occurred recently on this company record$/, async () => {
    await auditContact
      .verify.containsText('@changedItemsCount', '2 changes')
  })

  Then(/^I see the field names that were recently changed on this company record$/, async () => {
    await auditContact
      .verify.containsText('@fieldNameFromList', 'Business description')
  })
})
