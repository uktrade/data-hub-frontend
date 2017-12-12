const { assign } = require('lodash')
const contactSearchResult = require('~/test/unit/data/contacts/contact-search-result.json')
const contact = require('~/test/unit/data/contacts/contact.json')
const company = require('~/test/unit/data/companies/companies-house-company.json')

const {
  transformContactToListItem,
  transformContactToView,
} = require('~/src/apps/contacts/transformers')

describe('Contact transformers', function () {
  describe('#transformContactToListItem', () => {
    it('should return undefined for unqualified result', () => {
      expect(transformContactToListItem()).to.be.undefined
      expect(transformContactToListItem({ a: 'b' })).to.be.undefined
      expect(transformContactToListItem({ id: 'abcd' })).to.be.undefined
      expect(transformContactToListItem({ first_name: 'Peter', last_name: 'Great' })).to.be.undefined
    })

    it('should return an object with data for active contact list item', () => {
      const actual = transformContactToListItem(contactSearchResult)

      expect(actual).to.have.property('id').a('string')
      expect(actual).to.have.property('type').a('string')
      expect(actual).to.have.property('name').a('string')
      expect(actual).to.have.property('isArchived').a('boolean').to.be.false
      expect(actual).to.have.property('meta').an('array').to.deep.equal([
        { label: 'Company', value: 'Fred ltd' },
        { label: 'Job title', value: 'Director' },
        { label: 'Sector', value: 'Aerospace' },
        { label: 'Country', value: 'United Kingdom' },
        { label: 'Updated on', type: 'datetime', value: '2017-02-14T14:49:17' },
        { label: 'Contact type', type: 'badge', value: 'Primary', badgeModifier: 'secondary' },
      ])
    })

    it('should return an object with data for archived contact list item', () => {
      const archivedContact = Object.assign({}, contactSearchResult, {
        archived: true,
        archived_on: '2017-03-14T14:49:17',
        archived_by: 'Sam Smith',
        archived_reason: 'Left job',
      })
      const actual = transformContactToListItem(archivedContact)

      expect(actual).to.have.property('id').a('string')
      expect(actual).to.have.property('type').a('string')
      expect(actual).to.have.property('name').a('string')
      expect(actual).to.have.property('isArchived').a('boolean').to.be.true
      expect(actual).to.have.property('meta').an('array').to.deep.equal([
        { label: 'Company', value: 'Fred ltd' },
        { label: 'Job title', value: 'Director' },
        { label: 'Sector', value: 'Aerospace' },
        { label: 'Country', value: 'United Kingdom' },
        { label: 'Updated on', type: 'datetime', value: '2017-02-14T14:49:17' },
        { label: 'Contact type', type: 'badge', value: 'Primary', badgeModifier: 'secondary' },
        { label: 'Status', type: 'badge', value: 'Archived' },
      ])
    })
  })

  describe('#transformContactToView', () => {
    context('when the contact record is fully populated', () => {
      beforeEach(() => {
        this.view = transformContactToView(contact, company)
      })

      it('should return all the required fields', () => {
        expect(this.view).to.have.ordered.keys([
          'Job title',
          'Phone number',
          'Alternative telephone',
          'Address',
          'Email',
          'Alternative email',
          'Notes',
          'Email marketing',
        ])
      })

      it('should return the job title', () => {
        expect(this.view).to.have.property('Job title', 'Forward Quality Associate')
      })

      it('should return the alternative phone number', () => {
        expect(this.view).to.have.property('Alternative telephone', '666555444')
      })

      it('should return the main email', () => {
        expect(this.view).to.have.property('Email', 'Rebecca.Lowe@example.com')
      })

      it('should return the alternative email', () => {
        expect(this.view).to.have.property('Alternative email', 'Lowe.Rebecca@example.com')
      })

      it('should return the notes', () => {
        expect(this.view).to.have.property('Notes', 'ProductRebecca')
      })
    })

    context('when the contact does not want to receive marketing by email', () => {
      beforeEach(() => {
        this.view = transformContactToView(assign({}, contact, {
          accepts_dit_email_marketing: false,
        }), company)
      })

      it('should show that they do not want to receive marketing by email', () => {
        expect(this.view).to.have.property('Email marketing', 'No')
      })
    })

    context('when the contact does want to receiving marketing by email', () => {
      beforeEach(() => {
        this.view = transformContactToView(assign({}, contact, {
          accepts_dit_email_marketing: true,
        }), company)
      })

      it('should show that they do not want to receive marketing by email', () => {
        expect(this.view).to.have.property('Email marketing', 'Yes')
      })
    })

    context('when the contact has an empty international dialling code', () => {
      beforeEach(() => {
        this.view = transformContactToView(assign({}, contact, {
          telephone_countrycode: '',
          telephone_number: '1234',
        }), company)
      })

      it('should set the telephone number without a dialling code', () => {
        expect(this.view).to.have.property('Phone number', '1234')
      })
    })

    context('when the contact does not have an international dialling code', () => {
      beforeEach(() => {
        this.view = transformContactToView(assign({}, contact, {
          telephone_countrycode: null,
          telephone_number: '1234',
        }), company)
      })

      it('should set the telephone number without a dialling code', () => {
        expect(this.view).to.have.property('Phone number', '1234')
      })
    })

    context('when the contact has an international dialling code', () => {
      beforeEach(() => {
        this.view = transformContactToView(assign({}, contact, {
          telephone_countrycode: '44',
          telephone_number: '1234',
        }), company)
      })

      it('should set the telephone number with the dialling code', () => {
        expect(this.view).to.have.property('Phone number', '(44) 1234')
      })
    })

    context('when the contact has their own address', () => {
      beforeEach(() => {
        this.view = transformContactToView(assign({}, contact, {
          address_1: 'Bridge House',
          address_2: 'Bridge Lane',
          address_town: 'Maidenhead',
          address_county: 'Berkshire',
          address_country: {
            id: '4321',
            name: 'United Kingdom',
          },
          address_postcode: 'SL1 11LL',
          address_same_as_company: false,
        }), company)
      })

      it('uses the contacts address', () => {
        expect(this.view).to.have.property('Address', 'Bridge House, Bridge Lane, Maidenhead, Berkshire, SL1 11LL, United Kingdom')
      })
    })

    context('when the contact uses a company trading address', () => {
      beforeEach(() => {
        this.view = transformContactToView(
          assign({}, contact, { address_same_as_company: true }),
          assign({}, company, {
            trading_address_1: 'Business Innovation & Skills',
            trading_address_2: '1 Victoria Street',
            trading_address_town: 'London',
            trading_address_county: 'Greater London',
            trading_address_postcode: 'SW1H 0ET',
            trading_address_country: {
              id: '1234',
              name: 'United Kingdom',
            },
            registerd_address_1: '5TH FLOOR, PROFILE WEST',
            registered_address_2: '950 GREAT WEST ROAD',
            registered_address_town: 'BRENTFORD',
            registered_address_county: 'MIDDLESEX',
            registered_address_postcode: 'TW8 9ES',
            registered_address_country: {
              name: 'United Kingdom',
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
            },
          })
        )
      })

      it('should use the company trading address', () => {
        expect(this.view).to.have.property('Address', 'Business Innovation & Skills, 1 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom')
      })
    })

    context('when the contact uses the company registered address', () => {
      beforeEach(() => {
        this.view = transformContactToView(
          assign({}, contact, { address_same_as_company: true }),
          assign({}, company, {
            trading_address_1: null,
            trading_address_2: null,
            trading_address_town: null,
            trading_address_county: null,
            trading_address_postcode: null,
            trading_address_country: null,
            registerd_address_1: '5TH FLOOR, PROFILE WEST',
            registered_address_2: '950 GREAT WEST ROAD',
            registered_address_town: 'BRENTFORD',
            registered_address_county: 'MIDDLESEX',
            registered_address_postcode: 'TW8 9ES',
            registered_address_country: {
              name: 'United Kingdom',
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
            },
          })
        )
      })

      it('should use the company registered address', () => {
        expect(this.view).to.have.property('Address', '5TH FLOOR, PROFILE WEST, 950 GREAT WEST ROAD, BRENTFORD, MIDDLESEX, TW8 9ES, United Kingdom')
      })
    })
  })
})
