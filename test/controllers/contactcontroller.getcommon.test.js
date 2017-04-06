/* globals expect: true, describe: true, it: true, beforeEach: true */
const proxyquire = require('proxyquire')

describe('Contact controller, getCommon', function () {
  let contactController = {}
  let throwError = false
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

    contactController = proxyquire('../../src/controllers/contactcontroller', {
      '../services/contactservice': {
        getInflatedContact: function (token, id) {
          return new Promise((resolve, reject) => {
            if (throwError) {
              reject('error')
            } else {
              resolve(contact)
            }
          })
        }
      }
    })
  })
  it('should render an error when the contact service fails', function (done) {
    throwError = true
    const req = {
      session: {
        token: '1234'
      },
      params: {
        id: '3333'
      }
    }
    const res = {
      locals: {},
      render: function (template, options) {
        expect(template).to.include('error')
        done()
      }
    }
    contactController.getCommon(req, res)
  })
})
