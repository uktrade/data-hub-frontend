/* eslint camelcase: 0 */
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')
const { startCase } = require('lodash')
const { format } = require('date-fns')

defineSupportCode(({ Before, Then, When }) => {
  const Form = client.page.Form()
  const Event = client.page.Event()
  const EventList = client.page.EventList()

  Before(() => {
    Form.state = {}
  })

  // Whens
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

  When(/^I change text field (.+) to (.+)$/, async (selector, fieldValue) => {
    let value = fieldValue

    if (fieldValue === 'random words') {
      value = faker.lorem.words(4)
    }

    if (fieldValue === 'a random paragraph') {
      value = faker.lorem.paragraph()
    }

    if (fieldValue === 'a random street address') {
      value = faker.address.streetAddress()
    }

    Form.state[selector] = value

    await Event
      .replaceValue(selector, Form.state[selector])
  })

  When(/^I change start date to decrease year by one$/, async () => {
    const currentDate = new Date()

    await Form.getState()

    await Event
      .api.perform(() => {
        const start_date_year = Form.state.start_date_year || format(currentDate, 'YYYY')

        Form.state = {
          '@startDateYear': parseInt(start_date_year, 10) - 1,
          '@startDateMonth': Form.state.start_date_month || format(currentDate, 'MM'),
          '@startDateDay': Form.state.start_date_day || format(currentDate, 'DD'),
        }

        return Event
          .replaceValue('@startDateYear', Form.state['@startDateYear'])
          .replaceValue('@startDateMonth', Form.state['@startDateMonth'])
          .replaceValue('@startDateDay', Form.state['@startDateDay'])
      })
  })

  When(/^I change dropdown (.+) to be (.+)/, async (fieldName, newValue) => {
    Form.state[fieldName] = newValue

    await Event
      .clickListOption(fieldName, Form.state[fieldName])
  })

  // Thens
  Then(/^I verify that (.+) contains value I entered for (.+)$/, async (selector, formStateProp) => {
    await Event
      .assert.containsText(selector, Form.state[formStateProp])
  })

  Then(/^I verify that (.+) contains title-case value I entered for (.+)$/, async (selector, formStateProp) => {
    await Event
      .assert.containsText(selector, startCase(Form.state[formStateProp]))
  })

  Then(/^I verify that (.+) contains text (.+)$/, async (selector, newValue) => {
    await Event
      .assert.containsText(selector, newValue)
  })

  Then(/^I verify that the start date has been updated$/, async () => {
    await Event
      .assert.containsText('@startDateFromDetails', Form.state['@startDateYear'])
  })

  When(/^I change event additional reference code field to a new value$/, async () => {
  })

  Then(/^I verify the event additional reference code is updated with new value$/, async () => {
  })

  When(/^I click on form option (.+)$/, async (selector) => {
    await Event
      .click(selector)

    await Form.getState()

    Form.state[selector] = Form.state.event_shared
  })
})
