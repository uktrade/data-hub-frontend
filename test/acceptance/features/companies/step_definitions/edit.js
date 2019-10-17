const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')

const { getSelectorForDetailsSectionEditButton } = require('../../../helpers/selectors')

const Company = client.page.companies.company()

// TODO this could well become something generic used across all buttons
When(/^I click the (.+) edit button/, async (linkTextContent) => {
  const { selector: editButton } = getSelectorForDetailsSectionEditButton(linkTextContent)

  await Company
    .api.useXpath()
    .waitForElementVisible(editButton)
    .click(editButton)
    .useCss()
})
