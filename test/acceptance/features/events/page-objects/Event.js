const faker = require('faker')
const { addWeeks, format } = require('date-fns')
const { camelCase, isNull, pickBy, keys, assign } = require('lodash')

const { getButtonWithText } = require('../../../helpers/selectors')

module.exports = {
  url: `${process.env.QA_HOST}/events/create`,
  props: {},
  elements: {
    eventName: 'input[name="name"]',
    eventNameError: 'label[for=field-name] span:nth-child(2)',
    eventType: 'select[name="event_type"]',
    eventTypeError: 'label[for=field-event_type] span:nth-child(2)',
    startDateYear: 'input[name="start_date_year"]',
    startDateMonth: 'input[name="start_date_month"]',
    startDateDay: 'input[name="start_date_day"]',
    endDateYear: 'input[name="end_date_year"]',
    endDateMonth: 'input[name="end_date_month"]',
    endDateDay: 'input[name="end_date_day"]',
    locationType: 'select[name="location_type"]',
    addressLine1: 'input[name="address_1"]',
    addressLine1Error: 'label[for=field-address_1] span:nth-child(2)',
    addressLine2: 'input[name="address_2"]',
    addressTown: 'input[name="address_town"]',
    addressTownError: 'label[for=field-address_town] span:nth-child(2)',
    addressCounty: 'input[name="address_county"]',
    addressPostcode: 'input[name="postcode"]',
    addressCountry: 'select[name="address_country"]',
    addressCountryError: 'label[for=field-address_country] span:nth-child(2)',
    ukRegion: 'select[name="uk_region"]',
    ukRegionError: 'label[for=field-uk_region] span:nth-child(2)',
    notes: 'textarea[name="notes"]',
    service: 'select[name="service"]',
    serviceError: 'label[for=field-service] span:nth-child(2)',
    leadTeam: 'select[name="lead_team"]',
    organiser: 'select[name="organiser"]',
    sharedYes: 'label[for=field-event_shared-1]',
    sharedNo: 'label[for=field-event_shared-2]',
    teams: '#field-teams',
    addAnotherSharedTeam: 'input[name="add_team"]',
    relatedProgrammes: '#field-related_programmes',
    addAnotherProgramme: 'input[name="add_related_programme"]',
    editButton: getButtonWithText('Edit Event'),
    saveButton: getButtonWithText('Save'),
  },
  commands: [
    {
      selectListOption (listName, optionNumber) {
        return this
          .click(`select[name="${listName}"] option:nth-child(${optionNumber})`)
      },
      assertVisibleTeamsList (listNumber) {
        return this
          .assert.visible('#group-field-teams #group-field-teams:nth-child(' + listNumber + ') select')
      },
      assertVisibleRelatedProgrammesList (listNumber) {
        return this
          .assert.visible('#group-field-related_programmes #group-field-related_programmes:nth-child(' + listNumber + ') select')
      },
      populateCreateEventForm ({ details = {}, callback }) {
        const today = new Date()
        const futureDate = addWeeks(today, 1)
        const event = assign({}, {
          name: faker.company.companyName(),
          address_1: faker.address.streetName(),
          address_2: faker.address.secondaryAddress(),
          address_town: faker.address.city(),
          postcode: faker.address.zipCode(),
          start_date_year: format(new Date(), 'YYYY'),
          start_date_month: format(new Date(), 'MM'),
          start_date_day: format(new Date(), 'D'),
          end_date_year: format(futureDate, 'YYYY'),
          end_date_month: format(futureDate, 'MM'),
          end_date_day: format(futureDate, 'D'),
          notes: faker.lorem.sentence(),
          location_type: null,
          service: null,
          event_type: null,
          address_country: null,
          organiser: null,
          lead_team: null,
          related_programmes: null,
          teams: null,
        }, details)

        this
          .waitForElementPresent('@sharedYes')
          .click('@sharedYes')
          .api.perform(async (done) => {
            // get select options text

            this
              .api.perform((done) => {
                keys(pickBy(event, isNull)).map((key) => {
                  this.getListOption(`@${camelCase(key)}`, (optionText) => {
                    event[key] = optionText
                    done()
                  })
                })
              })

            if (event.address_country === 'United Kingdom') {
              this
                .api.perform((done) => {
                  this.getListOption('@ukRegion', (ukRegion) => {
                    event.uk_region = ukRegion
                    done()
                  })
                })
            }

            this
              .api.perform((done) => {
                // loop through all form inputs and set stored values
                for (const key in event) {
                  if (event[key]) {
                    this.setValue(`[name="${key}"]`, event[key])
                  }
                }
                done()
              })

            done()
          })

        callback(event)
        return this
      },
    },
  ],
}
