/* globals expect:true, describe: true, beforeEach: true, it: true */
const moment = require('moment')
const itemCollectionService = require('../../src/services/itemcollectionservice')

describe('item collection services', () => {
  let contacts

  beforeEach(() => {
    contacts = [
      {
        id: '5882c56c-07b1-422d-8fd4-00969e707dc7',
        teams: [],
        interactions: [],
        address: {
          address_county: 'Berkshire',
          address_town: 'Windsor',
          address_country: 'United Kingdom',
          address_4: null,
          address_2: 'Chawridge Lane',
          address_1: 'Blackthorn Cottage',
          address_postcode: 'SL4 4QR',
          address_3: null
        },
        archived: false,
        archived_on: '2010-11-03T12:22:47.443000',
        archived_reason: '',
        created_on: '2010-11-03T12:00:20.337000',
        modified_on: '2010-11-03T12:00:20.337000',
        first_name: 'Bill',
        last_name: 'Smith',
        primary: true,
        telephone_countrycode: '+44',
        telephone_number: '012345678',
        email: 'bill@fred.com',
        address_same_as_company: true,
        telephone_alternative: null,
        email_alternative: null,
        notes: null,
        archived_by: null,
        title: {id: 'd5d9b924-6095-e211-a939-e4115bead28a', name: 'Major'},
        role: {
          id: 'dc02a687-5da3-e211-a646-e4115bead28a',
          name: 'Managing Director'
        },
        company: {
          id: '698700a6-8615-435b-8850-564cf0e70cb2',
          archived: false,
          archived_on: null,
          archived_reason: '',
          created_on: '2016-11-03T11:47:54.519000',
          modified_on: '2016-11-03T11:47:54.519000',
          name: 'Fred',
          registered_address_1: 'Blackthorn Cottage',
          registered_address_2: 'Chawridge Lane',
          registered_address_3: null,
          registered_address_4: null,
          registered_address_town: 'Windsor',
          registered_address_county: 'Berkshire',
          registered_address_postcode: 'SL4 4QR',
          company_number: null,
          alias: null,
          description: null,
          website: null,
          trading_address_1: null,
          trading_address_2: null,
          trading_address_3: null,
          trading_address_4: null,
          trading_address_town: null,
          trading_address_county: null,
          trading_address_postcode: null,
          archived_by: null,
          registered_address_country: [Object],
          business_type: [Object],
          sector: [Object],
          employee_range: null,
          turnover_range: null,
          account_manager: null,
          uk_region: [Object],
          trading_address_country: null,
          export_to_countries: [],
          future_interest_countries: []
        }
      },
      {
        id: '6aadfaf5-3cc7-4530-87d9-b09375764e4e',
        teams: [],
        interactions: [],
        address: {
          address_county: 'Berkshire',
          address_town: 'Windsor',
          address_country: 'United Kingdom',
          address_4: null,
          address_2: 'Chawridge Lane',
          address_1: 'Blackthorn Cottage',
          address_postcode: 'SL4 4QR',
          address_3: null
        },
        archived: true,
        archived_on: '2016-11-03T12:26:43.175000',
        archived_reason: 'Contact has left the company',
        created_on: '2016-11-04T12:00:11.449000',
        modified_on: '2016-11-04T12:00:11.449000',
        first_name: 'Bob',
        last_name: 'Smith',
        primary: false,
        telephone_countrycode: '+44',
        telephone_number: '0123456',
        email: 'bob@fred.com',
        address_same_as_company: true,
        telephone_alternative: null,
        email_alternative: null,
        notes: null,
        archived_by: null,
        title: {
          id: 'd6d9b924-6095-e211-a939-e4115bead28a',
          name: 'Major General'
        },
        role: {
          id: 'dc02a687-5da3-e211-a646-e4115bead28a',
          name: 'Managing Director'
        },
        company: {
          id: '698700a6-8615-435b-8850-564cf0e70cb2',
          archived: false,
          archived_on: null,
          archived_reason: '',
          created_on: '2016-11-03T11:47:54.519000',
          modified_on: '2016-11-03T11:47:54.519000',
          name: 'Fred',
          registered_address_1: 'Blackthorn Cottage',
          registered_address_2: 'Chawridge Lane',
          registered_address_3: null,
          registered_address_4: null,
          registered_address_town: 'Windsor',
          registered_address_county: 'Berkshire',
          registered_address_postcode: 'SL4 4QR',
          company_number: null,
          alias: null,
          description: null,
          website: null,
          trading_address_1: null,
          trading_address_2: null,
          trading_address_3: null,
          trading_address_4: null,
          trading_address_town: null,
          trading_address_county: null,
          trading_address_postcode: null,
          archived_by: null,
          registered_address_country: [Object],
          business_type: [Object],
          sector: [Object],
          employee_range: null,
          turnover_range: null,
          account_manager: null,
          uk_region: [Object],
          trading_address_country: null,
          export_to_countries: [],
          future_interest_countries: []
        }
      }
    ]
  })

  describe('Calculate item collection headings', () => {
    it('should say when 1 day since last added contact', () => {
      contacts[1].created_on = moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const time = itemCollectionService.getTimeSinceLastAddedItem(contacts)

      expect(time.amount).to.equal('1')
      expect(time.unit).to.equal('day')
    })
    it('should say when 2 days since last added contact', () => {
      contacts[1].created_on = moment().subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const time = itemCollectionService.getTimeSinceLastAddedItem(contacts)

      expect(time.amount).to.equal('2')
      expect(time.unit).to.equal('days')
    })
    it('should say when 6 months since last added contact', () => {
      contacts[1].created_on = moment().subtract(6, 'months').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const time = itemCollectionService.getTimeSinceLastAddedItem(contacts)
      expect(time.amount).to.equal('6')
      expect(time.unit).to.equal('months')
    })
    it('should say when 2 years since last added contact', () => {
      contacts[1].created_on = moment().subtract(2, 'years').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const time = itemCollectionService.getTimeSinceLastAddedItem(contacts)
      expect(time.amount).to.equal('2')
      expect(time.unit).to.equal('years')
    })
    it('should handle a null date', () => {
      contacts[0].created_on = null
      contacts[1].created_on = moment().subtract(2, 'years').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const time = itemCollectionService.getTimeSinceLastAddedItem(contacts)

      expect(time.amount).to.equal('2')
      expect(time.unit).to.equal('years')
    })
    it('should handle all null', () => {
      contacts[0].created_on = null
      contacts[1].created_on = null
      const time = itemCollectionService.getTimeSinceLastAddedItem(contacts)
      expect(time).to.be.null
    })
  })

  describe('get items in time range', () => {
    it('should return 1 single contact in the last year', () => {
      contacts[0].created_on = moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      contacts[1].created_on = moment().subtract(18, 'months').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const filtered = itemCollectionService.getItemsAddedInLastYear(contacts)
      expect(filtered).to.have.lengthOf(1)
    })
    it('should return 2 contacts in the last year', () => {
      contacts[0].created_on = moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      contacts[1].created_on = moment().subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const filtered = itemCollectionService.getItemsAddedInLastYear(contacts)
      expect(filtered).to.have.lengthOf(2)
    })
    it('should handle a null', () => {
      contacts[0].created_on = null
      contacts[1].created_on = moment().subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
      const filtered = itemCollectionService.getItemsAddedInLastYear(contacts)
      expect(filtered).to.have.lengthOf(1)
    })
    it('should handle all null', () => {
      contacts[0].created_on = null
      contacts[1].created_on = null
      const filtered = itemCollectionService.getItemsAddedInLastYear(contacts)
      expect(filtered).to.have.lengthOf(0)
    })
  })
})
