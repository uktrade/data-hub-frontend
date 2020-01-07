/* eslint camelcase: 0 */
const { assign, set } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')
const { format } = require('date-fns')

const Form = client.page.form()
const Event = client.page.events.event()

When(/^I change start date to decrease year by one$/, async function() {
  const currentDate = new Date()
  const form = {}

  await Form.getState((result) => {
    set(form, 'state', result.value)
  })

  await Event.api.perform(() => {
    const start_date_year =
      form.state.start_date_year || format(currentDate, 'YYYY')

    this.state = assign({}, this.state, {
      start_date_year: parseInt(start_date_year, 10) - 1,
      start_date_month:
        form.state.start_date_month || format(currentDate, 'MM'),
      start_date_day: form.state.start_date_day || format(currentDate, 'DD'),
    })

    return Event.replaceValue('@startDateYear', this.state.start_date_year)
      .replaceValue('@startDateMonth', this.state.start_date_month)
      .replaceValue('@startDateDay', this.state.start_date_day)
  })
})
