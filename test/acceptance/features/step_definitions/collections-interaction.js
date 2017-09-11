const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Interaction = client.page.Interaction()
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const CollectionsInteraction = client.page.CollectionsInteraction()
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
    await CollectionsInteraction
      .verify.visible('@interactionsTab')
  })

  When(/^I click on interaction tab$/, async () => {
    await CollectionsInteraction
      .click('@interactionsTab')
  })

  Then(/^I view the first and last name of the contact involved in the interaction$/, async () => {
    await CollectionsInteraction
      .assert.containsText('@nameFromList', Interaction.contactName)
  })

  Then(/^I view the subject line of the interaction$/, async () => {
    await CollectionsInteraction
      .assert.containsText('@subjectFromList', subject)
  })

  Then(/^I view the date of the interaction$/, async () => {
    const datetime = format(new Date(), 'D MMM YYYY')
    await CollectionsInteraction
      .assert.containsText('@dateFromList', datetime)
  })

  Then(/^I view the company name of the interaction$/, async () => {
    await CollectionsInteraction
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
