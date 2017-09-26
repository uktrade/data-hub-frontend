const faker = require('faker')
const { addWeeks, format } = require('date-fns')

module.exports = {
  url: process.env.QA_HOST + '/events/create',
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
    sharedYesContainer: '#group-field-event_shared div div',
    sharedNoContainer: '#group-field-event_shared div div:nth-child(2)',
    sharedYes: 'label[for=field-event_shared-1]',
    sharedNo: 'label[for=field-event_shared-2]',
    teams: '#field-teams',
    addAnotherSharedTeam: 'input[name="add_team"]',
    relatedProgrammes: '#field-related_programmes',
    addAnotherProgramme: 'input[name="add_related_programme"]',
    saveButton: {
      selector: '//button[text() = \'Save and Continue\']',
      locateStrategy: 'xpath',
    },
    // Event details page
    eventNameFromDetails: 'a',
    eventTypeFromDetails: 'a',
    additionalRefCodeFromDetails: 'a',
    startDateFromDetails: 'a',
    endDateFromDetails: 'a',
    locationTypeFromDetails: 'a',
    addressLine1FromDetails: 'a',
    addressLine2FromDetails: 'a',
    addressTownFromDetails: 'a',
    addressPostcodeFromDetails: 'a',
    addressCountryFromDetails: 'a',
    notesFromDetails: 'a',
    teamHostingFromDetails: 'a',
    organiserFromDetails: 'a',
    sharedYesFromDetails: 'a',
    sharedTeamsFromDetails: 'a',
    relatedProgrammesFromDetails: 'a',
  },
  commands: [
    {
      selectListOptionByText (listName, text) {
        return this
          .click('xpath', `//select[@name="${listName}"]/option[normalize-space(.)="${text}"]`)
      },
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
      populateCreateEventForm () {
        const today = new Date()
        const futureDate = addWeeks(today, 1)

        // Store created event details
        this.state.eventDetails = {
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
          notes: faker.lorem.paragraph(),
          location_type: null,
          service: null,
          event_type: null,
          address_country: null,
          organiser: null,
          lead_team: null,
          related_programmes: null,
          teams: null,
        }

        return this
          .getListOption('@eventType', (eventType) => {
            this.state.eventDetails.event_type = eventType
          })
          .getListOption('@locationType', (locationType) => {
            this.state.eventDetails.location_type = locationType
          })
          .getListOption('@addressCountry', (country) => {
            this.state.eventDetails.address_country = country

            if (country === 'United Kingdom') {
              this.getListOption('@ukRegion', (ukRegion) => {
                this.state.eventDetails.uk_region = ukRegion
              })
            }
          })
          .getListOption('@leadTeam', (leadTeam) => {
            this.state.eventDetails.lead_team = leadTeam
          })
          .getListOption('@service', (service) => {
            this.state.eventDetails.service = service
          })
          .getListOption('@organiser', (organiser) => {
            this.state.eventDetails.organiser = organiser
          })
          .getListOption('@teams', (teams) => {
            this.state.eventDetails.teams = teams
          })
          .getListOption('@relatedProgrammes', (relatedProgrammes) => {
            this.state.eventDetails.related_programmes = relatedProgrammes
          })
          .click('@sharedYes')
          .api.perform(() => {
            // loop through all form inputs and set stored values
            for (const key in this.state.eventDetails) {
              if (this.state.eventDetails[key]) {
                this.setValue(`[name="${key}"]`, this.state.eventDetails[key])
              }
            }
          })
      },
    },
  ],
}
