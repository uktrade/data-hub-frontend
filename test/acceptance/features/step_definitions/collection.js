const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Collection = client.page.collection()

Then('I see a sort option', async () => {
  await Collection.section.collectionHeader.assert.visible('@sortBy')
})

Then('I cannot see a sort option', async () => {
  await Collection.section.collectionHeader.assert.elementNotPresent('@sortBy')
})
