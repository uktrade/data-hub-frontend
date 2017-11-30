const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, set } = require('lodash')

defineSupportCode(({ When, Then }) => {
  const Support = client.page.Support()

  When(/^the support Send button is clicked$/, async function () {
    await Support.section.form
      .click('@sendButton')
  })

  Then(/^the support fields have error messages$/, async function () {
    await Support.section.form
      .assert.visible('@titleError')
      .assert.visible('@chooseOneOfTheseError')
      .assert.visible('@emailError')
  })

  Then(/^a new support request is created$/, async function () {
    await Support
      .createSupportTicket({}, (supportRequest) => {
        set(this.state, 'supportRequest', supportRequest)
      })
  })

  Then(/^the success message contains the ticket ID/, async function () {
    const ticketId = get(this.state, 'ticket.id')
    const expectedText = `Created new report, reference number ${ticketId}`

    await Support
      .assert.containsText('@flashMessage', expectedText)
  })
})
