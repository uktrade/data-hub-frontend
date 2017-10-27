const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Message = client.page.Message()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const ContactList = client.page.ContactList()
  const AuditContact = client.page.AuditContact()
  const AuditList = client.page.AuditList()
  const InvestmentStage = client.page.InvestmentStage()
  const foreignCompanyName = 'Lambda Plc'
  let contactName
  let telephone
  let countryCode
  let userName

  Then(/^I Amend (.*) records of an existing contact record$/, async (number) => {
    telephone = faker.phone.phoneNumber()
    countryCode = faker.random.number()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await ContactList
      .click('@contactsTab')
    await Contact
      .getText('@firstCompanyFromList', (result) => {
        contactName = result.value
      })
      .click('@firstCompanyFromList')
    await AuditContact
      .editContactDetails(telephone, countryCode, number)
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^I search for this Contact record$/, async () => {
    await Company
      .navigate()
      .findCompany(contactName)
    await ContactList
      .click('@contactsTab')
    await Contact
      .click('@firstCompanyFromList')
    await AuditContact
      .getText('@userName', (result) => {
        userName = result.value
      })
  })

  When(/^I navigate to Audit History tab$/, async () => {
    await AuditContact
      .click('@auditHistoryTab')
  })

  Then(/^I see the name of the person who made the recent contact record changes$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', userName)
  })

  Then(/^I see the date time stamp when the recent contact record changed$/, async () => {
    const today = format(new Date(), 'D MMM YYYY')
    await AuditList.section.firstAuditInList
      .assert.containsText('@header', today)
  })

  Then(/^I see the total number of changes occurred recently on this contact record$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@changeCount', '2 changes')
  })

  Then(/^I see the field names that were recently changed$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@fields', 'Phone number')
  })

  Given(/^I archive an existing contact record$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await ContactList
      .click('@contactsTab')
    await AuditList.section.lastContactInList
      .getText('@header', (result) => {
        contactName = result.value
      })
      .click('@header')
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^I archive this contact record$/, async () => {
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^I unarchive this contact record$/, async () => {
    await AuditContact
      .click('@unarchiveAnContactButton')
    await Message
      .verifyMessage('success')
  })

  Then(/^I see the details who archived the contact$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', userName)
  })

  Then(/^I see the details who unarchived the contact$/, async () => {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', userName)
  })
})
