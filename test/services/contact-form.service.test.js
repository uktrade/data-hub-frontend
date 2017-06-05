/* eslint prefer-promise-reject-errors: 0 */

describe('contact form service', function () {
  let contactFormService
  let postedData
  let throwError

  beforeEach(function () {
    throwError = false

    contactFormService = proxyquire('~/src/services/contact-form.service', {
      '../repos/contact.repo': {
        savedContactForm: null,
        saveContact: function (token, contactForm) {
          return new Promise((resolve, reject) => {
            postedData = contactForm

            if (throwError) {
              return reject({ error: 'test error' })
            }

            if (!contactForm.id || contactForm.id.length === 0) {
              contactForm = Object.assign({}, { id: '1234' }, contactForm)
            }

            resolve(contactForm)
          })
        },
      },
    })
  })

  describe('convert API contact into form format', function () {
    let contact

    beforeEach(function () {
      contact = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        name: 'Zac Baman',
        address_1: '99 N Shore Road',
        address_2: 'Suite 20',
        address_3: '',
        address_4: '',
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
        telephone_countrycode: '+1',
        telephone_number: '652423467167',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: false,
        telephone_alternative: '999',
        email_alternative: 'fred@me.com',
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
        advisor: null,
      }
    })

    it('should convert a fully populated expanded contact into a flat form format', function () {
      const expected = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        company: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        title: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        first_name: 'Zac',
        last_name: 'Baman',
        job_title: 'Co-founder and CEO',
        primary: 'yes',
        telephone_number: '652423467167',
        telephone_countrycode: '+1',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: 'no',
        address_1: '99 N Shore Road',
        address_2: 'Suite 20',
        address_3: null,
        address_4: null,
        address_town: 'Town view',
        address_county: 'CA',
        address_postcode: '94043',
        address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
        telephone_alternative: '999',
        email_alternative: 'fred@me.com',
        notes: 'Some notes',
      }

      const actual = contactFormService.getContactAsFormData(contact)

      expect(actual).to.deep.equal(expected)
    })
    it('should handle blank and null fields', function () {
      contact.last_name = null
      contact.job_title = null
      contact.address_same_as_company = true
      contact.address_1 = ''
      contact.address_2 = ''
      contact.address_town = ''
      contact.address_county = ''
      contact.address_country = null
      contact.address_postcode = ''

      const expected = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        company: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        title: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        first_name: 'Zac',
        last_name: null,
        job_title: null,
        primary: 'yes',
        telephone_number: '652423467167',
        telephone_countrycode: '+1',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: 'yes',
        address_1: null,
        address_2: null,
        address_3: null,
        address_4: null,
        address_town: null,
        address_county: null,
        address_postcode: null,
        address_country: null,
        telephone_alternative: '999',
        email_alternative: 'fred@me.com',
        notes: 'Some notes',
      }

      const actual = contactFormService.getContactAsFormData(contact)

      expect(actual).to.deep.equal(expected)
    })
    it('should handle a null contact', function () {
      expect(contactFormService.getContactAsFormData(null)).to.be.null
    })
  })
  describe('save contact form', function () {
    let formData

    beforeEach(function () {
      formData = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        company: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        title: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        first_name: 'Zac',
        last_name: 'Baman',
        job_title: 'Co-founder and CEO',
        primary: 'yes',
        telephone_number: '652423467167',
        telephone_countrycode: '+1',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: 'no',
        address_1: '99 N Shore Road',
        address_2: 'Suite 20',
        address_3: '',
        address_4: '',
        address_town: 'Town view',
        address_county: 'CA',
        address_postcode: '94043',
        address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
        telephone_alternative: '999',
        email_alternative: 'fred@me.com',
        notes: 'Some notes',
      }
    })

    it('should accept a fully populated contact and convert it to an api format', function () {
      const expected = {
        id: '50680966-f5e1-e311-8a2b-e4115bead28a',
        company: {
          id: '44ea1e01-f5e1-e311-8a2b-e4115bead28a',
        },
        title: {
          id: '0167b456-0ddd-49bd-8184-e3227a0b6396',
        },
        first_name: 'Zac',
        last_name: 'Baman',
        job_title: 'Co-founder and CEO',
        primary: true,
        telephone_number: '652423467167',
        telephone_countrycode: '+1',
        email: 'zboasdaan@opasdasdov.com',
        address_same_as_company: false,
        address_1: '99 N Shore Road',
        address_2: 'Suite 20',
        address_3: null,
        address_4: null,
        address_town: 'Town view',
        address_county: 'CA',
        address_postcode: '94043',
        address_country: {
          id: '81756b9a-5d95-e211-a939-e4115bead28a',
        },
        telephone_alternative: '999',
        email_alternative: 'fred@me.com',
        notes: 'Some notes',
      }

      return contactFormService.saveContactForm('1234', formData)
      .then((savedContact) => {
        expect(postedData).to.deep.equal(expected)
      })
    })
    it('should return a copy of the saved contact', function () {
      delete formData.id

      return contactFormService.saveContactForm('1234', formData)
      .then((savedContact) => {
        expect(savedContact.id).to.not.be.null
      })
    })
    it('should throw errors received from the repository if the save fails', function () {
      throwError = true

      return contactFormService.saveContactForm('1234', formData)
      .catch((error) => {
        expect(error.error).to.equal('test error')
      })
    })
  })
})
