const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Interaction = client.page.Interaction()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const CollectionsInteractions = client.page.CollectionsInteractions()
  const foreignCompanyName = 'Lambda plc'
  let subject

  Given(/^I create a new interaction for a contact$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickSmsRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I search for this interaction name$/, async () => {
    await Company
      .navigate()
      .findCompany(subject)
  })

  Then(/^I view an interaction tab$/, async () => {
    await CollectionsInteractions
      .verify.visible('@interactionsTab')
  })

  When(/^I click on interaction tab$/, async () => {
    await CollectionsInteractions
      .click('@interactionsTab')
  })

  Then(/^I view the first and last name of the contact involved in the interaction$/, async () => {
    await CollectionsInteractions
      .assert.containsText('@nameFromList', Interaction.contactName)
  })

  Then(/^I view the subject line of the interaction$/, async () => {
    await CollectionsInteractions
      .assert.containsText('@subjectFromList', subject)
  })

  Then(/^I view the date of the interaction$/, async () => {
    const datetime = format(new Date(), 'D MMM YYYY')
    await CollectionsInteractions
      .assert.containsText('@dateFromList', datetime)
  })

  Then(/^I view the company name of the interaction$/, async () => {
    await CollectionsInteractions
      .assert.containsText('@companyFromList', foreignCompanyName)
  })

  When(/^I click on the first interaction collection link$/, async () => {
    await Contact
      .clickOnFirstCompanyFromList()
  })

  Then(/^I navigate to interaction details page$/, async () => {
    await Interaction
      .getText('@subjectFromInteractionTab', (result) => {
        Contact.assert.equal(result.value, subject)
      })
  })
})
