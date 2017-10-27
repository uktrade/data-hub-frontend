const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')

const getValue = (value) => {
  switch (value) {
    case 'random words':
      return faker.lorem.words(4)
    case 'a random paragraph':
      return faker.lorem.paragraph()
    case 'a random street address':
      return faker.address.streetAddress()
    default:
      return value.replace(/^"(.+)"$/g, '$1')
  }
}

defineSupportCode(({ When, Then }) => {
  const Form = client.page.Form()

  When(/^I change form text field "(.+)" to (.+)$/, async function (fieldName, fieldValue) {
    const fieldSelector = `[name="${fieldName}"]`

    this.state[fieldName] = getValue(fieldValue)

    await Form
      .replaceValue(fieldSelector, this.state[fieldName])
  })

  When(/^I change form dropdown "(.+)" to (.+)$/, async function (fieldName, fieldValue) {
    this.state[fieldName] = getValue(fieldValue)

    await Form
      .clickListOption(fieldName, this.state[fieldName])
  })

  When(/^I select "(.+)" for boolean option "(.+)"$/, async (label, fieldName) => {
    const fieldSelector = `//label[contains(., "${label}") and contains(@for, "field-${fieldName}")]`

    await Form
      .api.useXpath()
      .click(fieldSelector)
      .useCss()
  })

  When(/^I submit (.+) form$/, async (selector) => {
    selector = selector === 'the' ? 'form' : selector

    await Form
      .submitForm(selector)
  })

  Then(/^I see form error summary$/, async () => {
    await Form
      .assert.visible('@errorSummary')
  })
})
