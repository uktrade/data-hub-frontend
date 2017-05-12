/* globals expect: true, describe: true, it: true, beforeEach: true, sinon: true */
/* eslint no-unused-expressions: 0 */
const { render } = require('../nunjucks')
const proxyquire = require('proxyquire')
const next = function (error) {
  throw Error(error)
}

describe('Company interactions controller', function () {
  let company
  let companyinteractioncontroller

  beforeEach(function () {
    company = {
      id: '3f2b2a0f-0eb6-4299-8489-7390ccaa17f5',
      name: 'Fred',
      trading_name: '',
      companies_house_data: null,
      interactions: [{
        id: '22651151-2149-465e-871b-ac45bc568a62',
        interaction_type: { id: '1234', name: 'Email' },
        subject: 'Subject 1234',
        date: '2017-02-14T14:49:17',
        dit_advisor: { first_name: 'Fred', last_name: 'Smith' }
      }, {
        id: '22651151-2149-465e-871b-ac45bc568a63',
        interaction_type: { id: '1234', name: 'Service delivery' },
        subject: 'Subject 1234',
        date: '2017-02-14T14:49:17',
        dit_advisor: { first_name: 'Fred', last_name: 'Smith' }
      }],
      contacts: [
        {id: '12651151-2149-465e-871b-ac45bc568a62'},
        {id: '12651151-2149-465e-871b-ac45bc568a63'},
        {id: '12651151-2149-465e-871b-ac45bc568a64'}
      ],
      export_to_countries: [],
      future_interest_countries: [],
      uk_based: true,
      account_manager: null,
      registered_address_1: 'Annexe -  Blackthorn Cottage',
      registered_address_2: 'Chawridge Lane',
      registered_address_3: '',
      registered_address_4: '',
      registered_address_town: 'Windsor',
      registered_address_country: {
        id: '80756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United Kingdom'
      },
      registered_address_county: 'Berkshire',
      registered_address_postcode: 'SL4 4QR',
      created_on: '2016-10-24T12:06:14',
      modified_on: '2016-10-24T12:06:14',
      archived: false,
      archived_on: null,
      archived_reason: null,
      company_number: null,
      alias: '',
      lead: false,
      description: '',
      website: null,
      trading_address_1: '',
      trading_address_2: '',
      trading_address_3: '',
      trading_address_4: '',
      trading_address_town: '',
      trading_address_county: '',
      trading_address_postcode: '',
      archived_by: null,
      business_type: {
        id: '9bd14e94-5d95-e211-a939-e4115bead28a',
        name: 'Intermediary',
        selectable: true
      },
      sector: {
        id: 'b722c9d2-5f95-e211-a939-e4115bead28a',
        name: 'Aerospace : Maintenance',
        selectable: true
      },
      employee_range: null,
      turnover_range: null,
      uk_region: {
        id: '844cd12a-6095-e211-a939-e4115bead28a',
        name: 'East Midlands',
        selectable: true
      },
      trading_address_country: null,
      headquarter_type: null,
      classification: null
    }
    companyinteractioncontroller = proxyquire('../../src/controllers/company-interaction.controller', {
      '../services/company.service': {
        getInflatedDitCompany: sinon.stub().resolves(company)
      }
    })
  })

  describe('data', function () {
    it('should return a list of interactions', function (done) {
      const req = {
        session: { token: '1234' },
        params: { id: '1' }
      }
      const res = {
        locals: {},
        render: function (template, options) {
          expect(res.locals).to.have.property('interactions')
          expect(res.locals.interactions).to.have.length(2)
          done()
        }
      }
      companyinteractioncontroller.getInteractions(req, res, next)
    })
    it('should return a url to add interactions if a valid company and has contacts', function (done) {
      const req = {
        session: { token: '1234' },
        params: { id: '1' }
      }
      const res = {
        locals: {},
        render: function (template, options) {
          expect(res.locals).to.have.property('addInteractionUrl')
          done()
        }
      }
      companyinteractioncontroller.getInteractions(req, res, next)
    })
    it('should not return a url to add interactions if not a valid company', function (done) {
      company.id = null
      company.companies_house_data = { name: 'Fred' }
      companyinteractioncontroller = proxyquire('../../src/controllers/company-interaction.controller', {
        '../services/company.service': {
          getInflatedDitCompany: sinon.stub().resolves(company)
        }
      })
      const req = {
        session: { token: '1234' },
        params: { id: '1' }
      }
      const res = {
        locals: {},
        render: function (template, options) {
          expect(res.locals).to.not.have.property('addInteractionUrl')
          done()
        }
      }
      companyinteractioncontroller.getInteractions(req, res, next)
    })
    it('should not return a url to add interactions if no contacts', function (done) {
      company.contacts = []
      companyinteractioncontroller = proxyquire('../../src/controllers/company-interaction.controller', {
        '../services/company.service': {
          getInflatedDitCompany: sinon.stub().resolves(company)
        }
      })
      const req = {
        session: { token: '1234' },
        params: { id: '1' }
      }
      const res = {
        locals: {},
        render: function (template, options) {
          expect(res.locals).to.not.have.property('addInteractionUrl')
          done()
        }
      }
      companyinteractioncontroller.getInteractions(req, res, next)
    })
  })

  describe('markup', function () {
    let interactions
    let addInteractionUrl

    beforeEach(function () {
      interactions = [{
        url: '/interaction/1/details',
        interaction_type: 'Email',
        subject: 'Test subject',
        date: '23 February 2017',
        advisor: 'Fred Smith',
        contact: 'Jim Brown'
      }, {
        url: '/servicedelivery/2/details',
        interaction_type: 'Service Delivery',
        subject: 'Test subject',
        date: '23 February 2017',
        advisor: 'Fred Smith',
        contact: 'Simon Carter'
      }]

      addInteractionUrl = '/interaction/add?company=1234'
    })
    it('should warn the user if there are no interactions and no contacts to associate with interactions', function () {
      company.contacts = []
      return render('../../src/views/company/interactions.html', {interactions: [], addInteractionUrl, company, addContact: 'test'})
      .then((document) => {
        expect(document.querySelector('#no-contact-warning.infostrip').textContent).to.include('You currently have no contacts for this company. To add an interaction you must first add a contact.')
        expect(document.querySelector('#no-contact-warning.infostrip a').href).to.equal('test')
      })
    })

    it('should render a list of interactions', function () {
      return render('../../src/views/company/interactions.html', {interactions, addInteractionUrl, company})
      .then((document) => {
        expect(document.getElementById('interaction-list')).to.not.be.null
      })
    })

    it('each line should include the required data', function () {
      return render('../../src/views/company/interactions.html', {interactions, addInteractionUrl, company})
      .then((document) => {
        const interactionElement = document.querySelector('#interaction-list .interaction')
        expect(interactionElement.innerHTML).to.include('Test subject')
        expect(interactionElement.innerHTML).to.include('Email')
        expect(interactionElement.innerHTML).to.include('23 February 2017')
        expect(interactionElement.innerHTML).to.include('Fred Smith')
        expect(interactionElement.innerHTML).to.include('Jim Brown')
      })
    })

    it('include a link to add a new interaction', function () {
      return render('../../src/views/company/interactions.html', {interactions, addInteractionUrl, company})
      .then((document) => {
        const link = document.querySelector('a#add-interaction-link')
        expect(link.href).to.eq('/interaction/add?company=1234')
      })
    })
    it('should not render interactions if there are none and warn user', function () {
      return render('../../src/views/company/interactions.html', {interactions: [], addInteractionUrl, company})
      .then((document) => {
        expect(document.getElementById('interaction-list')).to.be.null
        expect(document.querySelector('#no-interaction-warning.infostrip').textContent).to.include('You currently have no interactions for this company')
      })
    })
  })
})
