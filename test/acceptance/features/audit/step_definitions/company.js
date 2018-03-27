const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { Given, Then, When } = require('cucumber')
const { set } = require('lodash')

const Message = client.page.message()
const Company = client.page.companies.company()
const Contact = client.page.contacts.contact()
const AuditContact = client.page.audit.contact()
const AuditCompany = client.page.audit.company()
const AuditList = client.page.audit.list()

Given(/^I Amend (.*) records of an existing company record$/, async function (number) {
  await Company
    .navigate()
    .findCompany('Venus')
  await AuditList.section.lastContactInList
    .getText('@header', (result) => set(this.state, 'companyName', result.value))
    .click('@header')
  await AuditCompany
    .editCompanyRecords(faker.name.jobDescriptor(), faker.internet.url(), number)
    .submitForm('form')
  await Message
    .verifyMessage('success')
})

When(/^I search for this company record$/, async function () {
  await Company
    .navigate()
    .findCompany(this.state.companyName)
  await Contact
    .click('@firstCompanyFromList')
  await AuditContact
    .getText('@userName', (result) => set(this.state, 'username', result.value))
})

Then(/^I see the name of the person who made the recent company record changes$/, async function () {
  await AuditContact
    .getText('@userName', (result) => set(this.state, 'username', result.value))

  await AuditList.section.firstAuditInList
    .assert.containsText('@adviser', this.state.username)
})

Then(/^I see the date time stamp when the recent company record changed$/, async function () {
  const today = format(new Date(), 'D MMM YYYY')
  await AuditList.section.firstAuditInList
    .assert.containsText('@header', today)
})

Then(/^I see the total number of changes occurred recently on this company record$/, async function () {
  await AuditList.section.firstAuditInList
    .assert.containsText('@changeCount', '2 changes')
})

Then(/^I see the field names that were recently changed on this company record$/, async function () {
  await AuditList.section.firstAuditInList
    .assert.containsText('@fields', 'Business description')
})
