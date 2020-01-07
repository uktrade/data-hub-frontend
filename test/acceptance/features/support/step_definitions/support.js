const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get } = require('lodash')

const Support = client.page.support()

When(/^the support Send button is clicked$/, async function() {
  await Support.section.form.click('@sendButton')
})

Then(/^the support fields have error messages$/, async function() {
  await Support.section.form.assert
    .visible('@titleError')
    .assert.visible('@chooseOneOfTheseError')
    .assert.visible('@emailError')
})

Then(/^the success message contains the ticket ID/, async function() {
  const ticketId = get(this.state, 'ticket.id')
  const expectedText = `Created new report, reference number ${ticketId}`

  await Support.assert.containsText('@flashMessage', expectedText)
})
