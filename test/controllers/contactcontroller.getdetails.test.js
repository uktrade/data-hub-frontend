/* globals expect: true, describe: true, it: true, beforeEach: true */
const contactController = require('../../src/controllers/contactcontroller')
const { contactDetailsLabels } = require('../../src/labels/contactlabels')
const nunjucks = require('nunjucks')
const jsdom = require('jsdom')
const filters = require('@uktrade/trade_elements/dist/nunjucks/filters')

nunjucks.configure('views')
const nunenv = nunjucks.configure([`${__dirname}/../../src/views`, `${__dirname}/../../node_modules/@uktrade/trade_elements/dist/nunjucks`], {
  autoescape: true
})

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName])
})

describe('Contact controller, getDetails', function () {
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
  describe('data', function () {
    it('should include formatted contact data', function (done) {
      const req = {
        session: {}
      }
      const res = {
        locals: { contact, id: '1234' },
        render: function (url, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions).to.have.property('contactDetails')
          expect(allOptions).to.have.property('contactDetailsLabels')
          expect(allOptions.contactDetailsLabels).to.deep.equal(contactDetailsLabels)
          done()
        }
      }
      contactController.getDetails(req, res, null)
    })
  })
  describe('markup', function () {
    let contactDetails

    beforeEach(function () {
      contactDetails = {
        title: 'Mr',
        job_title: 'Director',
        telephone_number: '+44 7814 333 777',
        email: 'fred@test.com',
        address: '10 The Street, Warble, Big Town, Large County, LL1 1LL, United Kingdom',
        telephone_alternative: '07814 000 333',
        email_alternative: 'fred@gmail.com',
        notes: 'some notes'
      }
    })

    it('should render a contact details section')
    it('should include the contact details in a key value table')
    it('should display the contact name and address in a heading')
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}

function renderContent (locals) {
  return new Promise((resolve, reject) => {
    const markup = nunjucks.render('../../src/views/contact/index.html', locals)
    jsdom.env(markup, (err, jsdomWindow) => {
      if (err) {
        reject(err)
      }
      resolve(jsdomWindow.document)
    })
  })
}
