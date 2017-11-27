const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

defineSupportCode(({ When }) => {
  When(/^browsing to event fixture (.+)$/, async function (eventName) { // TODO can this be DRY'd up?
    const events = map(this.fixtures.event, (event) => { return event })
    const event = find(events, { name: eventName })
    const url = this.urls.events.getDetails(event.pk)

    set(this.state, 'event', event)

    await client
      .url(url)
  })
})
