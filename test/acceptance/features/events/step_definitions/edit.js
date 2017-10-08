/* eslint camelcase: 0 */
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { format } = require('date-fns')

const World = require('../../../helpers/world')

defineSupportCode(({ Before, Then, When }) => {
  const Form = client.page.Form()
  const Event = client.page.Event()
  const EventList = client.page.EventList()

  Before(() => {
    World.resetState()
  })

  // When

  When(/^I navigate to event details page$/, async () => {
    await EventList
      .navigate()
      .section.firstEventInList
      .click('@header')
  })

  When(/^I click on edit event button$/, async () => {
    await Event
      .click('@editButton')
  })

  When(/^I change start date to decrease year by one$/, async () => {
    const currentDate = new Date()

    await Form.getState()

    await Event
      .api.perform(() => {
        const start_date_year = Form.state.start_date_year || format(currentDate, 'YYYY')

        World.state = Object.assign({}, World.state, {
          start_date_year: parseInt(start_date_year, 10) - 1,
          start_date_month: Form.state.start_date_month || format(currentDate, 'MM'),
          start_date_day: Form.state.start_date_day || format(currentDate, 'DD'),
        })

        return Event
          .replaceValue('@startDateYear', World.state.start_date_year)
          .replaceValue('@startDateMonth', World.state.start_date_month)
          .replaceValue('@startDateDay', World.state.start_date_day)
      })
  })
})
