const format = require('date-fns/format')
const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { set } = require('lodash')

const Message = client.page.message()
const AuditContact = client.page.audit.contact()
const AuditCompany = client.page.audit.company()
const AuditList = client.page.audit.list()

When(/^I edit the company$/, async function() {
  await AuditCompany.submitForm('form')
  await Message.verifyMessage('success')
})

Then(
  /^I see the name of the person who made the recent company record changes$/,
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
  /^I see the date time stamp when the recent company record changed$/,
  async function() {
    const today = format(new Date(), 'D MMM YYYY')
    await AuditList.section.firstAuditInList.assert.containsText(
      '@header',
      today
    )
  }
)

Then(
  /^I see the total number of changes occurred recently on this company record$/,
  async function() {
    await AuditList.section.firstAuditInList.assert.containsText(
      '@changeCount',
      '2 changes'
    )
  }
)
