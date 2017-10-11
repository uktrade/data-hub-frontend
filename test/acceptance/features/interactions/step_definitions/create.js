const faker = require('faker')
const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const Interaction = client.page.Interaction()
  const foreignCompanyName = 'Lambda plc'
  let subject
  let contactname

  When(/^I navigate to Interactions page of any company$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
  })

  Then(/^I verify an option to add a new Interaction$/, async () => {
    await Interaction
      .assert.visible('@addInteractionButton')
  })

  When(/^I add a new Business card interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickBusinessCardRadioButton()
      .enterNewInteractionDetails(subject)
      .setValue('@interactionPageCompanyContact', 'a')
      .getText('@interactionPageCompanyContactList', (result) => {
        contactname = result.value
      })
      .click('@interactionPageCompanyContactList')
      .submitForm('form')
  })

  When(/^I add a new Email-Website interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickEmailWebsiteRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Face to face interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickFaceToFaceRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Fax interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickFaxRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Letter-Fax interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickLetterFaxRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Service delivery interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickServiceDeliveryRadioButton()
      .setAdditionalFieldsForServiceDelivery(subject)
  })

  When(/^I add a new SMS interaction$/, async () => {
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

  When(/^I add a new Social Media interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickSocialMediaRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Telephone interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickTelephoneRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Telex interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickTelexRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new UKTI Website interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickUktiWebsiteRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Undefined interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickUndefinedRadioButton()
      .enterNewInteractionDetails(subject)
  })

  When(/^I add a new Video-Teleconf interaction$/, async () => {
    subject = faker.random.word()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .clickAddInteractionButton()
      .clickVideoTeleconfRadioButton()
      .enterNewInteractionDetails(subject)
  })

  Then(/^I verify my newly added Interaction in company profile$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .navigateToInteractionsPage()
      .getText('@subjectFromInteractionTab', (result) => {
        Contact.assert.equal(result.value, subject)
      })
  })

  Then(/^I verify my newly added Interaction under search landing page$/, async () => {
    await Company
      .navigate()
    await Interaction
      .assert.containsText('@interactionUnderSearchPage', foreignCompanyName)
      .assert.containsText('@interactionUnderSearchPage', subject)
  })

  Then(/^I see the edit interaction button to confirm successful adding$/, async () => {
    await Interaction
      .assert.containsText('@editInteractionButton', 'Edit interaction')
  })

  Then(/^I see the edit service delivery button to confirm successful adding$/, async () => {
    await Interaction
      .assert.containsText('@editInteractionButton', 'Edit service delivery details')
  })

  When(/^I navigate to interactions collections$/, async () => {
    await Company
      .navigate()
      .findCompany(Interaction.subject)
    await Interaction
      .assert.visible('@interactionsCollectionsTab')
      .click('@interactionsCollectionsTab')
  })

  Then(/^I view the first and last name of the contact involved in the interaction$/, async () => {
    await Interaction
      .assert.containsText('@contactNameFromList', contactname)
  })

  Then(/^I view the subject line of the interaction$/, async () => {
    await Interaction
      .assert.containsText('@subjectFromList', Interaction.subject)
  })

  Then(/^the date of the interaction is as expected$/, async () => {
    const datetime = format(new Date(), 'D MMMM YYYY')
    await Interaction
      .assert.containsText('@dateFromList', datetime)
  })

  Then(/^I view the company name of the interaction$/, async () => {
    await Interaction
      .assert.containsText('@companyFromList', foreignCompanyName)
  })

  Then(/^clicking the interaction name takes me to the interaction details page$/, async () => {
    await Contact
      .clickOnFirstCompanyFromList()
    await Interaction
      .assert.containsText('@subjectFromInteractionDetailsPage', Interaction.subject)
  })

  Then(/^I navigate to contact interactions$/, async () => {
    await Contact
      .navigateToContactsPage()
      .clickOnFirstContactFromList()
      .clickOnContactInteractions()
  })
})
