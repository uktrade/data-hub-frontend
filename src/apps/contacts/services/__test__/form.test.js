/* eslint prefer-promise-reject-errors: 0 */
const { assign } = require('lodash')
const proxyquire = require('proxyquire')

describe('contact form service', () => {
  let contactFormService
  beforeEach(() => {
    contactFormService = proxyquire('../form', { '../repos': {} })
  })

  describe('convert API contact into form format', () => {
    const contactData = {
      id: '50680966-f5e1-e311-8a2b-e4115bead28a',
      name: 'Zac Baman',
      address_1: '99 N Shore Road',
      address_2: 'Suite 20',
      address_town: 'Town view',
      address_country: {
        id: '81756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United States',
      },
      address_county: 'CA',
      address_postcode: '94043',
      created_on: '2014-05-22T21:09:45',
      modified_on: '2016-04-28T17:06:44',
      archived: false,
      archived_on: null,
      archived_reason: '',
      first_name: 'Zac',
      last_name: 'Baman',
      job_title: 'Co-founder and CEO',
      primary: true,
      full_telephone_number: '+1 652423467167',
      email: 'zboasdaan@opasdasdov.com',
      address_same_as_company: false,
      notes: 'Some notes',
      archived_by: null,
      title: {
        id: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        name: 'Undefined',
      },
      company: {
        id: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        name: 'OpenStuff',
      },
      adviser: null,
    }

    it('should convert a fully populated expanded contact into a flat form format', () => {
      const contact = assign({}, contactData)

      const expected = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        company: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        title: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        first_name: 'Zac',
        last_name: 'Baman',
        job_title: 'Co-founder and CEO',
        primary: 'yes',
        full_telephone_number: '+1 652423467167',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: 'no',
        address_1: '99 N Shore Road',
        address_2: 'Suite 20',
        address_town: 'Town view',
        address_county: 'CA',
        address_postcode: '94043',
        address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
        notes: 'Some notes',
      }

      const actual = contactFormService.getContactAsFormData(contact)

      expect(actual).to.deep.equal(expected)
    })

    it('should handle blank and null fields', () => {
      const contact = assign({}, contactData, {
        last_name: null,
        job_title: null,
        address_same_as_company: true,
        address_1: '',
        address_2: '',
        address_town: '',
        address_county: '',
        address_country: null,
        address_postcode: '',
      })

      const expected = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        company: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        title: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        first_name: 'Zac',
        last_name: null,
        job_title: null,
        primary: 'yes',
        full_telephone_number: '+1 652423467167',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: 'yes',
        address_1: null,
        address_2: null,
        address_town: null,
        address_county: null,
        address_postcode: null,
        address_country: null,
        notes: 'Some notes',
      }

      const actual = contactFormService.getContactAsFormData(contact)

      expect(actual).to.deep.equal(expected)
    })

    it('should handle a null contact', () => {
      expect(contactFormService.getContactAsFormData(null)).to.be.null
    })
  })
})
