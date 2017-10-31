const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { merge, set } = require('lodash')

const { getUid, appendUid } = require('../../../helpers/uuid')

const companySearchPage = `${process.env.QA_HOST}/search/companies` // TODO move these urls out into a url world object
const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ Given, Then, When }) => {
  const Search = client.page.Search()
  const Message = client.page.Message()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const ContactList = client.page.ContactList()
  const AuditContact = client.page.AuditContact()
  const AuditList = client.page.AuditList()
  const InvestmentStage = client.page.InvestmentStage()

  Given(/^a company is created for audit/, async function () {
    const companyName = appendUid(faker.company.companyName())

    await client
      .url(companySearchPage)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany(
        { name: companyName },
        (company) => set(this.state, 'company', company),
      )
      .wait() // wait for backend to sync
  })

  Given(/^I archive an existing contact record$/, async function () {
    await Company
      .navigate()
      .findCompany(this.fixtures.foreignCompany.name)
    await ContactList
      .click('@contactsTab')
    await AuditList.section.lastContactInList
      .getText('@header', (result) => set(this.state, 'contactName', result.value))
      .click('@header')
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^a primary contact is added for audit$/, async function () {
    await Contact
      .createNewContact({}, true, (contact) => set(this.state, 'contact', contact))
  })

  When(/^navigating to the company contacts for audit$/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.company.name))

    await Company
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .waitForElementVisible('@contacts')
      .click('@contacts')

    await Company
      .waitForElementVisible('@addContactButton')
  })

  When(/^the contact has ([0-9]) fields edited for audit$/, async function (count) {
    await Contact
      .getText('@firstCompanyFromList', (result) => set(this.state, 'contactName', result.value))
      .click('@firstCompanyFromList')

    await AuditContact
      .editContactDetails({}, count, (contact) => {
        set(this.state, 'contact', merge({}, this.state.contact, contact))
      })
  })

  When(/^I search for this Contact record$/, async function () {
    await Company
      .navigate()
      .findCompany(this.state.contactName)
    await ContactList
      .click('@contactsTab')
    await Contact
      .click('@firstCompanyFromList')
    await AuditContact
      .getText('@userName', (result) => set(this.state, 'username', result.value))
  })

  When(/^I navigate to Audit History tab$/, async function () {
    await AuditContact
      .click('@auditHistoryTab')
  })

  When(/^I archive this contact record$/, async function () {
    await InvestmentStage
      .click('@archiveButton')
    await AuditContact
      .click('@archiveReason')
      .submitForm('form')
    await Message
      .verifyMessage('success')
  })

  When(/^I unarchive this contact record$/, async function () {
    await AuditContact
      .click('@unarchiveAnContactButton')
    await Message
      .verifyMessage('success')
  })

  Then(/^I see the name of the person who made the recent contact record changes$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', this.state.username)
  })

  Then(/^I see the date time stamp when the recent contact record changed$/, async function () {
    const today = format(new Date(), 'D MMM YYYY')
    await AuditList.section.firstAuditInList
      .assert.containsText('@header', today)
  })

  Then(/^I see the total number of changes occurred recently on this contact record$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@changeCount', '2 changes')
  })

  Then(/^I see the field names that were recently changed$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@fields', 'Phone number')
  })

  Then(/^I see the details who archived the contact$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', this.state.username)
  })

  Then(/^I see the details who unarchived the contact$/, async function () {
    await AuditList.section.firstAuditInList
      .assert.containsText('@adviser', this.state.username)
  })
})
