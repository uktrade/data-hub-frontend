const contactFormattingService = require('~/src/services/contact-formatting.service')

describe('Contact formatting service', function () {
  let contact
  let company

  beforeEach(function () {
    contact = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      created_on: '2017-02-14T14:49:17',
      modified_on: '2017-02-14T14:49:17',
      archived: false,
      archived_on: null,
      archived_reason: '',
      first_name: 'Fred',
      last_name: 'Smith',
      job_title: 'Director',
      primary: true,
      telephone_countrycode: '+44',
      telephone_number: '07814 333 777',
      email: 'fred@test.com',
      address_same_as_company: false,
      address_1: '10 The Street',
      address_2: 'Warble',
      address_town: 'Big Town',
      address_county: 'Large County',
      address_postcode: 'LL1 1LL',
      telephone_alternative: '07814 000 333',
      email_alternative: 'fred@gmail.com',
      notes: 'some notes',
      archived_by: null,
      title: {
        id: 'a26cb21e-6095-e211-a939-e4115bead28a',
        name: 'Mr',
      },
      adviser: null,
      address_country: null,
    }

    company = {
      id: '9876',
      'name': 'My Coorp',
    }
  })
  describe('contact details', function () {
    it('Should convert a typical contact into its display format', function () {
      const expected = {
        job_title: 'Director',
        telephone_number: '+44 7814 333 777',
        email: 'fred@test.com',
        address: '10 The Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
        telephone_alternative: '07814 000 333',
        email_alternative: 'fred@gmail.com',
        notes: 'some notes',
      }

      const actual = contactFormattingService.getDisplayContact(contact, company)
      expect(actual).to.deep.equal(expected)
    })
    it('should use a company trading address if the contact has no address but has a company trading address', function () {
      const companyWithExpectedAddress = {
        id: '1234',
        registered_address_1: '20 The Street',
        registered_address_2: 'rarble',
        registered_address_town: 'Small Town',
        registered_address_county: 'Small County',
        registered_address_postcode: 'RR1 1PP',
        trading_address_1: '30 The Street',
        trading_address_2: 'Tarble',
        trading_address_town: 'Medium Town',
        trading_address_county: 'Medium County',
        trading_address_postcode: 'TT1 1TT',
      }

      contact.address_1 = ''
      contact.address_2 = ''
      contact.address_town = ''
      contact.address_county = ''
      contact.address_postcode = ''
      contact.address_country = null
      contact.company = companyWithExpectedAddress

      const formatted = contactFormattingService.getDisplayCompanyContact(contact, companyWithExpectedAddress)
      expect(formatted.address).to.equal('30 The Street, Tarble, Medium Town, Medium County, TT1 1TT, United Kingdom')
    })
    it('should use a company trading address if the contact has no address but has a company registered address', function () {
      const companyWithExpectedAddress = {
        id: '1234',
        registered_address_1: '20 The Street',
        registered_address_2: 'Rarble',
        registered_address_town: 'Small Town',
        registered_address_county: 'Small County',
        registered_address_postcode: 'RR1 1PP',
        trading_address_1: '',
        trading_address_2: '',
        trading_address_town: '',
        trading_address_county: '',
        trading_address_postcode: '',
      }

      contact.address_1 = ''
      contact.address_2 = ''
      contact.address_town = ''
      contact.address_county = ''
      contact.address_postcode = ''
      contact.address_country = null
      contact.company = companyWithExpectedAddress

      const formatted = contactFormattingService.getDisplayCompanyContact(contact, companyWithExpectedAddress)
      expect(formatted.address).to.equal('20 The Street, Rarble, Small Town, Small County, RR1 1PP, United Kingdom')
    })
  })
  describe('company contact', function () {
    it('Should convert a typical contact into its company display format', function () {
      const expected = {
        id: '12651151-2149-465e-871b-ac45bc568a62',
        url: '/contact/12651151-2149-465e-871b-ac45bc568a62/details',
        name: 'Fred Smith',
        job_title: 'Director',
        telephone_number: '+44 7814 333 777',
        email: 'fred@test.com',
        added: '14 Feb 2017',
        address: '10 The Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
        email_alternative: 'fred@gmail.com',
        notes: 'some notes',
        telephone_alternative: '07814 000 333',
      }

      const actual = contactFormattingService.getDisplayCompanyContact(contact, company)
      expect(actual).to.deep.equal(expected)
    })
    it('Should use the trading address if no contact address but has a trading address in company', function () {
      const companyWithExpectedAddress = {
        id: '1234',
        registered_address_1: '20 The Street',
        registered_address_2: 'Rarble',
        registered_address_town: 'Small Town',
        registered_address_county: 'Small County',
        registered_address_postcode: 'RR1 1PP',
        trading_address_1: '30 The Street',
        trading_address_2: 'Tarble',
        trading_address_town: 'Medium Town',
        trading_address_county: 'Medium County',
        trading_address_postcode: 'TT1 1TT',
      }

      contact.address_1 = ''
      contact.address_2 = ''
      contact.address_town = ''
      contact.address_county = ''
      contact.address_postcode = ''
      contact.address_country = null
      contact.company = companyWithExpectedAddress

      const formatted = contactFormattingService.getDisplayCompanyContact(contact, companyWithExpectedAddress)
      expect(formatted.address).to.equal('30 The Street, Tarble, Medium Town, Medium County, TT1 1TT, United Kingdom')
    })
    it('Should use the registered address if no contact address but has a registered address in company', function () {
      const companyWithExpectedAddress = {
        id: '1234',
        registered_address_1: '20 The Street',
        registered_address_2: 'Rarble',
        registered_address_town: 'Small Town',
        registered_address_county: 'Small County',
        registered_address_postcode: 'RR1 1PP',
        trading_address_1: '',
        trading_address_2: '',
        trading_address_town: '',
        trading_address_county: '',
        trading_address_postcode: '',
      }
      contact.address_1 = ''
      contact.address_2 = ''
      contact.address_town = ''
      contact.address_county = ''
      contact.address_postcode = ''
      contact.address_country = null
      contact.company = companyWithExpectedAddress

      const formatted = contactFormattingService.getDisplayCompanyContact(contact, companyWithExpectedAddress)
      expect(formatted.address).to.equal('20 The Street, Rarble, Small Town, Small County, RR1 1PP, United Kingdom')
    })
  })

  it('Should convert a typical archived contact into its company display format', function () {
    contact.archived_reason = 'Left company'
    contact.archived_by = {
      first_name: 'Fred',
      last_name: 'Flintstone',
    }
    contact.archived_on = '2017-02-14T14:49:17'

    const expected = {
      url: '/contact/12651151-2149-465e-871b-ac45bc568a62/details',
      name: 'Fred Smith',
      job_title: 'Director',
      reason: 'Left company',
      archived_by: 'Fred Flintstone',
      archived_on: '14 Feb 2017',
    }

    const actual = contactFormattingService.getDisplayArchivedCompanyContact(contact, company)
    expect(actual).to.deep.equal(expected)
  })
})
