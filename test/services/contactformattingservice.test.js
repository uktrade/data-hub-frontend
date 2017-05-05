/* globals expect: true, describe: true, it: true, beforeEach: true */
const contactFormattingService = require('../../src/services/contactformattingservice')

describe('Contact formatting service', function () {
  let contact

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
      address_3: '',
      address_4: '',
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
        selectable: true
      },
      advisor: null,
      address_country: null,
      teams: []
    }
  })
  it('Should convert a typical contact into its display format', function () {
    const expected = {
      job_title: 'Director',
      telephone_number: '+44 7814 333 777',
      email: 'fred@test.com',
      address: '10 The Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
      telephone_alternative: '07814 000 333',
      email_alternative: 'fred@gmail.com',
      notes: 'some notes'
    }

    const actual = contactFormattingService.getDisplayContact(contact)
    expect(actual).to.deep.equal(expected)
  })
  it('Should convert a typical contact into its company display format', function () {
    const expected = {
      url: '/contact/12651151-2149-465e-871b-ac45bc568a62/details',
      name: 'Fred Smith',
      job_title: 'Director',
      telephone_number: '+44 7814 333 777',
      email: 'fred@test.com',
      added: '14 Feb 2017',
      address: '10 The Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
      email_alternative: 'fred@gmail.com',
      notes: 'some notes',
      telephone_alternative: '07814 000 333'
    }

    const actual = contactFormattingService.getDisplayCompanyContact(contact)
    expect(actual).to.deep.equal(expected)
  })
  it('Should convert a typical archived contact into its company display format', function () {
    contact.archived_reason = 'Left company'
    contact.archived_by = {
      first_name: 'Fred',
      last_name: 'Flintstone'
    }
    contact.archived_on = '2017-02-14T14:49:17'

    const expected = {
      url: '/contact/12651151-2149-465e-871b-ac45bc568a62/details',
      name: 'Fred Smith',
      job_title: 'Director',
      reason: 'Left company',
      archived_by: 'Fred Flintstone',
      archived_on: '14 Feb 2017'
    }

    const actual = contactFormattingService.getDisplayArchivedCompanyContact(contact)
    expect(actual).to.deep.equal(expected)
  })
})
