const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then }) => {
  const Interaction = client.page.Interaction()

  Then(/^the interaction details Documents link is displayed$/, async function () {
    await Interaction
      .section.details
      .assert.visible('@documentsLink')
  })

  Then(/^the interaction details Documents link is not displayed$/, async function () {
    await Interaction
      .section.details
      .assert.elementNotPresent('@documentsLink')
  })
})
