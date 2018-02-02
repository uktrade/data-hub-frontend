/* eslint camelcase: 0 */
const { assign, set } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')
const { format } = require('date-fns')

const Form = client.page.Form()
const Event = client.page.events.Event()
const EventList = client.page.events.List()

// TODO feels like this can be DRY'd up (see location)
When(/^I navigate to event details page$/, async () => {
  await EventList
    .navigate()
    .section.firstEventInList
    .waitForElementPresent('@header')
    .click('@header')
})

When(/^I click on edit event button$/, async () => {
  await Event
    .click('@editButton')
})

When(/^I change start date to decrease year by one$/, async function () {
  const currentDate = new Date()
  const form = {}

  await Form.getState((result) => {
    set(form, 'state', result.value)
  })

  await Event
    .api.perform(() => {
      const start_date_year = form.state.start_date_year || format(currentDate, 'YYYY')

      this.state = assign({}, this.state, {
        start_date_year: parseInt(start_date_year, 10) - 1,
        start_date_month: form.state.start_date_month || format(currentDate, 'MM'),
        start_date_day: form.state.start_date_day || format(currentDate, 'DD'),
      })

      return Event
        .replaceValue('@startDateYear', this.state.start_date_year)
        .replaceValue('@startDateMonth', this.state.start_date_month)
        .replaceValue('@startDateDay', this.state.start_date_day)
    })
})
