const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Message = client.page.Message()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const AuditContact = client.page.AuditContact()
  const AuditCompany = client.page.AuditCompany()
  const AuditList = client.page.AuditList()
  const foreignCompanyName = 'Venus'
  let companyName
  let description
  let website
  let userName

  Given(/^I Amend (.*) records of an existing company record$/, async (number) => {
    description = faker.name.jobDescriptor()
    website = faker.internet.url()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await AuditList.section.lastContactInList
      .getText('@header', (result) => {
        companyName = result.value
      })
      .click('@header')
    await AuditCompany
      .editCompanyRecords(description, website, number)
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^I search for this company record$/, async () => {
    await Company
      .navigate()
      .findCompany(companyName)
    await Contact
      .click('@firstCompanyFromList')
    await AuditContact
      .getText('@userName', (result) => {
        userName = result.value
      })
  })

  Then(/^I see the name of the person who made the recent company record changes$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', userName)
  })

  Then(/^I see the date time stamp when the recent company record changed$/, async () => {
    const today = format(new Date(), 'D MMM YYYY')
    await AuditList.section.firstAuditInList
      .assert.containsText('@header', today)
  })

  Then(/^I see the total number of changes occurred recently on this company record$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@changeCount', '2 changes')
  })

  Then(/^I see the field names that were recently changed on this company record$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@fields', 'Business description')
  })
})
