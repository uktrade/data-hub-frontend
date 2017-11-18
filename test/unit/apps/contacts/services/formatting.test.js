const { assign } = require('lodash')

const contactFormattingService = require('~/src/apps/contacts/services/formatting')

describe('Contact formatting service', () => {
  describe('#getDisplayContact', () => {
    beforeEach(() => {
      this.contact = {
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
        telephone_number: '7814 333 777',
        email: 'fred@test.com',
        accepts_dit_email_marketing: false,
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

      this.company = {
        id: '9876',
        'name': 'My Coorp',
      }

      this.expected = {
        job_title: 'Director',
        telephone_number: '(+44) 7814 333 777',
        email: 'fred@test.com',
        email_marketing: 'No',
        address: '10 the Street, Warble, Big Town, Large County, LL1 1LL',
        telephone_alternative: '07814 000 333',
        email_alternative: 'fred@gmail.com',
        notes: 'some notes',
      }
    })

    context('when the contact does not want to receiving marketing by email', () => {
      it('should convert the contact to the display format', () => {
        const actual = contactFormattingService.getDisplayContact(this.contact, this.company)
        expect(actual).to.deep.equal(this.expected)
      })
    })

    context('when the contact does want to receiving marketing by email', () => {
      it('should convert the contact to the display format', () => {
        const contact = assign({}, this.contact, {
          accepts_dit_email_marketing: true,
        })

        const expected = assign({}, this.expected, {
          email_marketing: 'Yes',
        })

        const actual = contactFormattingService.getDisplayContact(contact, this.company)
        expect(actual).to.deep.equal(expected)
      })
    })

    context('when contact has an empty international code', () => {
      it('should set the telephone number', () => {
        const contact = assign({}, this.contact, {
          telephone_countrycode: '',
        })

        const expected = assign({}, this.expected, {
          telephone_number: '7814 333 777',
        })

        const actual = contactFormattingService.getDisplayContact(contact, this.company)
        expect(actual).to.deep.equal(expected)
      })
    })

    context('when contact does not have an international code', () => {
      it('should set the telephone number', () => {
        const contact = assign({}, this.contact, {
          telephone_countrycode: null,
        })

        const expected = assign({}, this.expected, {
          telephone_number: '7814 333 777',
        })

        const actual = contactFormattingService.getDisplayContact(contact, this.company)
        expect(actual).to.deep.equal(expected)
      })
    })
  })
})
