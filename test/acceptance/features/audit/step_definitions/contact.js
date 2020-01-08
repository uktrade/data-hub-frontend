const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { Given, Then, When } = require('cucumber')
const { merge, set } = require('lodash')

const { company: companyFixtures } = require('../../../fixtures')

const Message = client.page.message()
const Company = client.page.companies.company()
const Contact = client.page.contacts.contact()
const ContactList = client.page.contacts.list()
const AuditContact = client.page.audit.contact()
const AuditList = client.page.audit.list()
const InvestmentProject = client.page.investments.project()

Given(/^I archive an existing contact record$/, async function() {
  await Company.navigate().findCompany(companyFixtures.foreign.name)
  await ContactList.click('@contactsTab')
  await AuditList.section.lastContactInList
    .getText('@header', (result) =>
      set(this.state, 'contactName', result.value)
    )
    .click('@header')
  await InvestmentProject.section.projectDetails.section.archive.click(
    '@archiveButton'
  )
  await AuditContact.click('@archiveReason').submitForm('form')
  await Message.verifyMessage('success')
})

When(/^the contact has ([0-9]) fields edited for audit$/, async function(
  count
) {
  await AuditContact.editContactDetails({}, count, (contact) => {
    set(this.state, 'contact', merge({}, this.state.contact, contact))
  })
})

When(/^I search for this Contact record$/, async function() {
  await Company.navigate().findCompany(this.state.contactName)
  await ContactList.click('@contactsTab')
  await Contact.click('@firstCompanyFromList')
  await AuditContact.getText('@userName', (result) =>
    set(this.state, 'username', result.value)
  )
})

When(/^I archive this contact record$/, async function() {
  await InvestmentProject.section.projectDetails.section.archive.click(
    '@archiveButton'
  )
  await AuditContact.click('@archiveReason').submitForm('form')
  await Message.verifyMessage('success')
})

When(/^I unarchive this contact record$/, async function() {
  await AuditContact.click('@unarchiveAnContactButton')
  await Message.verifyMessage('success')
})

Then(
  /^I see the name of the person who made the recent contact record changes$/,
  async function() {
    await AuditContact.getText('@userName', (result) =>
      set(this.state, 'username', result.value)
    )

    await AuditList.section.firstAuditInList.assert.containsText(
      '@adviser',
      this.state.username
    )
  }
)

Then(
  /^I see the date time stamp when the recent contact record changed$/,
  async function() {
    const today = format(new Date(), 'D MMM YYYY')
    await AuditList.section.firstAuditInList.assert.containsText(
      '@header',
      today
    )
  }
)

Then(
  /^I see the total number of changes occurred recently on this contact record$/,
  async function() {
    await AuditList.section.firstAuditInList.assert.containsText(
      '@changeCount',
      '2 changes'
    )
  }
)

Then(/^I see the field names that were recently changed$/, async function() {
  await AuditList.section.firstAuditInList.assert.containsText(
    '@fields',
    'Phone number'
  )
})

Then(/^I see the details who archived the contact$/, async function() {
  await AuditContact.getText('@userName', (result) =>
    set(this.state, 'username', result.value)
  )

  await AuditList.section.firstAuditInList.assert.containsText(
    '@adviser',
    this.state.username
  )
})

Then(/^I see the details who unarchived the contact$/, async function() {
  await AuditContact.getText('@userName', (result) =>
    set(this.state, 'username', result.value)
  )

  await AuditList.section.firstAuditInList.assert.containsText(
    '@adviser',
    this.state.username
  )
})
