module.exports = {
  url: process.env.QA_HOST + '/events/create',
  props: {},
  elements: {
    eventName: 'input[name="event_name"]',
    eventType: 'select[name="event_type"]',
    additionalRefCode: 'a',
    startDateYear: 'input[name="event_start_date_year"]',
    startDateMonth: 'input[name="event_start_date_month"]',
    startDateDay: 'input[name="event_start_date_day"]',
    endDateYear: 'input[name="event_end_date_year"]',
    endDateMonth: 'input[name="event_end_date_year"]',
    endDateDay: 'input[name="event_end_date_year"]',
    locationType: 'select[name="event_location_type"]',
    addressLine1: 'input[name="address_1"]',
    addressLine2: 'input[name="address_2"]',
    addressTown: 'input[name="address_town"]',
    addressPostcode: 'input[name="address_county"]',
    addressCountry: 'select[name="country"]',
    notes: 'input[name="event_end_date_year"]',
    teamHosting: 'select[name="event_team_hosting"]',
    organiser: 'select[name="event_organiser"]',
    sharedYesContainer: '#group-field-event_shared div div',
    sharedNoContainer: '#group-field-event_shared div div:nth-child(2)',
    sharedYes: 'label[for=field-event_shared-1]',
    sharedNo: 'label[for=field-event_shared-2]',
    sharedTeams: '#field-teams',
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
      selectSharedTeam (optionNumber) {
        return this
          .click('select[name="teams"] option:nth-child(' + optionNumber + ')')
      },
      verifyVisibleSharedTeamList (listNumber) {
        return this
          .verify.visible('#group-field-teams #group-field-teams:nth-child(' + listNumber + ') select')
      },
      selectProgramme (optionNumber) {
        return this
          .click('select[name="related_programmes"] option:nth-child(' + optionNumber + ')')
      },
      verifyVisibleProgrammesList (listNumber) {
        return this
          .verify.visible('#group-field-related_programmes #group-field-related_programmes:nth-child(' + listNumber + ') select')
      },
    },
  ],
}
