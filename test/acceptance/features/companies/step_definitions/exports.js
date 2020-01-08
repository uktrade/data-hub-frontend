const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')
const { set, assign } = require('lodash')

const ExportsPage = client.page.companies.exports()

When('I update the company Exports details', async function() {
  await ExportsPage.updateExports((exports) => {
    const company = this.state.company
    set(this.state, 'company', assign({}, company, exports))
  })
})
