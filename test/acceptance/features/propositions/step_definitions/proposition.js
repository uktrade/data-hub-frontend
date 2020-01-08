const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get, set } = require('lodash')

const { getDateFor } = require('../../../helpers/date')

const Proposition = client.page.propositions.proposition()
const AbandonedProposition = client.page.propositions.abandon()
const CompletedProposition = client.page.propositions.complete()

When(/^a proposition is added$/, async function(kind) {
  await Proposition.createProposition(kind === 'proposition', (proposition) => {
    set(this.state, 'proposition', proposition)
    set(
      this.state,
      'proposition.deadline',
      getDateFor({
        year: get(this.state, 'proposition.deadlineOfPropositionYear'),
        month: get(this.state, 'proposition.deadlineOfPropositionMonth'),
        day: get(this.state, 'proposition.deadlineOfPropositionDay'),
      })
    )
  }).wait()
})

When(/^a proposition is abandoned/, async function(details) {
  await AbandonedProposition.abandonProposition((details) => {
    set(this.state, 'details', details)
  }).wait()
})

When(/^a proposition is completed/, async function(details) {
  await CompletedProposition.completeProposition((details) => {
    set(this.state, 'details', details)
  }).wait()
})

Then(/^there are proposition fields$/, async function() {
  await Proposition.waitForElementVisible('@name')
    .assert.visible('@name')
    .assert.visible('@scope')
    .assert.visible('@adviser')
    .assert.visible('@deadlineOfPropositionYear')
    .assert.visible('@deadlineOfPropositionMonth')
    .assert.visible('@deadlineOfPropositionDay')
})

Then(/^there is the details field$/, async function() {
  await AbandonedProposition.waitForElementVisible('@details').assert.visible(
    '@details'
  )
})
