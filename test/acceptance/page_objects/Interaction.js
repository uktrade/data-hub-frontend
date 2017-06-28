const faker = require('faker')
const companyName = ''
const title = ''
const type = ''

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    interactionsTab: {
      selector: "//nav/a[contains(@href, 'interactions')]",
      locateStrategy: 'xpath',
    },
    addInteractionButton: '#add-interaction-link',
    businessCardRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(1)',
    emailWebsiteRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(2)',
    faceToFaceRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(3)',
    faxRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(4)',
    letterFaxRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(5)',
    serviceDeliveryRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(7)',
    smsRadioButton: '#main-content form fieldset div div:nth-child(1) label:nth-child(7)',
    socialMediaRadioButton: '#main-content form fieldset div div:nth-child(2) label:nth-child(1)',
    telephoneRadioButton: '#main-content form fieldset div div:nth-child(2) label:nth-child(2)',
    telexRadioButton: '#main-content form fieldset div div:nth-child(2) label:nth-child(3)',
    uktiWebsiteRadioButton: '#main-content form fieldset div div:nth-child(2) label:nth-child(4)',
    undefinedRadioButton: '#main-content form fieldset div div:nth-child(2) label:nth-child(5)',
    videoTeleconfRadioButton: '#main-content form fieldset div div:nth-child(2) label:nth-child(6)',
    interactionPageTitle: '#main-content h1',
    interactionPageCompanyName: '#company-wrapper strong',
    interactionPageType: '#main-content form div:nth-child(5) strong',
    interactionPageSubject: '#subject',
    interactionPageNotes: '#notes',
    interactionPageCompanyContact: '#contact-wrapper input',
    interactionPageCompanyContactList: '#contact-wrapper ul li:nth-child(4)',
    interactionPageDateOfInteraction: '#date_day',
    interactionPageMonthOfInteraction: '#date_month',
    interactionPageYearOfInteraction: '#date_year',
    interactionPageDITadviser: '#dit_adviser',
    interactionPageServiceOffer: '#service-wrapper input',
    interactionPageServiceOfferList: '#service-wrapper ul li:nth-child(1)',
    interactionPageServiceProvider: '#dit_team-wrapper input',
    interactionPageServiceProviderList: '#dit_team-wrapper ul li:nth-child(1)',
    subjectFromInteractionTab: '#interaction-list li:nth-child(1) div:nth-child(1) span:nth-child(2)',
    interactionUnderSearchPage: '#interactions-list li:nth-child(1)',
    pickaEvent: '#event option:nth-child(2)',
    pickaStatus: '#status option:nth-child(2)',
    pickaUkRegion: '#uk_region option:nth-child(2)',
    pickaSector: '#sector option:nth-child(2)',
    countryOfInterest: '#country_of_interest-wrapper input',
    countryOfInterestList: '#country_of_interest-wrapper ul li:nth-child(6)',
    editInteractionButton: '#main-content a:nth-child(3)',
  },
  commands: [
    {
      clickInteractionsTab () {
        return this
          .click('@interactionsTab')
      },
      clickAddInteractionButton () {
        return this
          .click('@addInteractionButton')
      },
      clickBusinessCardRadioButton () {
        return this
          .click('@businessCardRadioButton')
      },
      clickEmailWebsiteRadioButton () {
        return this
          .click('@emailWebsiteRadioButton')
      },
      clickFaceToFaceRadioButton () {
        return this
          .click('@faceToFaceRadioButton')
      },
      clickFaxRadioButton () {
        return this
          .click('@faxRadioButton')
      },
      clickLetterFaxRadioButton () {
        return this
          .click('@letterFaxRadioButton')
      },
      clickServiceDeliveryRadioButton () {
        return this
          .click('@serviceDeliveryRadioButton')
      },
      clickSmsRadioButton () {
        return this
          .click('@smsRadioButton')
      },
      clickSocialMediaRadioButton () {
        return this
          .click('@socialMediaRadioButton')
      },
      clickTelephoneRadioButton () {
        return this
          .click('@telephoneRadioButton')
      },
      clickTelexRadioButton () {
        return this
          .click('@telexRadioButton')
      },
      clickUktiWebsiteRadioButton () {
        return this
          .click('@uktiWebsiteRadioButton')
      },
      clickUndefinedRadioButton () {
        return this
          .click('@undefinedRadioButton')
      },
      clickVideoTeleconfRadioButton () {
        return this
          .click('@videoTeleconfRadioButton')
      },
      getInteractionPageTitle () {
        return this
        .getText('@interactionPageTitle', (title))
      },
      getInteractionPageCompanyName () {
        return this
        .getText('@interactionPageCompanyName', (companyName))
      },
      getInteractionPageInteractionType () {
        return this
        .getText('@interactionPageType', (type))
      },
      enterSubject (subject) {
        return this
        .setValue('@interactionPageSubject', subject)
      },
      enterNotes (notes) {
        return this
        .setValue('@interactionPageNotes', notes)
      },
      enterCompanyContact (contactName) {
        return this
        .setValue('@interactionPageCompanyContact', contactName)
        .click('@interactionPageCompanyContactList')
      },
      enterDateOfInteraction (date) {
        return this
        .setValue('@interactionPageDateOfInteraction', date)
      },
      enterMonthOfInteraction (month) {
        return this
        .setValue('@interactionPageMonthOfInteraction', month)
      },
      enterYearOfInteraction (year) {
        return this
        .setValue('@interactionPageYearOfInteraction', year)
      },
      enterDITadviser (ditAdviser) {
        return this
        .setValue('@interactionPageDITadviser', ditAdviser)
      },
      enterServiceOffer (serviceAdviser) {
        return this
        .setValue('@interactionPageServiceOffer', serviceAdviser)
        .click('@interactionPageServiceOfferList')
      },
      enterServiceProvider (serviceProvider) {
        return this
        .setValue('@interactionPageServiceProvider', serviceProvider)
        .click('@interactionPageServiceProviderList')
      },
      navigateToInteractionsPage () {
        return this
          .click('@interactionsTab')
      },
      enterNewInteractionDetails (subject) {
        return this
          .submitForm('form')
          .enterSubject(subject)
          .enterNotes(faker.lorem.sentence())
          .enterCompanyContact('a')
          .enterServiceOffer('a')
          .enterServiceProvider('a')
        .submitForm('form')
      },
      selectEvent () {
        return this
        .click('@pickaEvent')
      },
      selectStatus () {
        return this
        .click('@pickaStatus')
      },
      selectUKRegion () {
        return this
          .click('@pickaUkRegion')
      },
      selectSector () {
        return this
          .click('@pickaSector')
      },
      selectCountryOfInterest () {
        return this
          .setValue('@countryOfInterest', 'a')
          .click('@countryOfInterestList')
      },
      setAdditionalFieldsForServiceDelivery (subject) {
        return this
          .submitForm('form')
          .enterServiceProvider('CBBC London')
          .enterServiceOffer('Events - UK Based')
          .enterSubject(subject)
          .enterNotes(faker.lorem.sentence())
          .enterCompanyContact('a')
          .selectStatus()
          .selectUKRegion()
          .selectSector()
          .selectCountryOfInterest()
        .submitForm('form')
      },
    },
  ],
}
