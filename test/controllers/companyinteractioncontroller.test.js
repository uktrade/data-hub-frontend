/* globals expect: true, describe: true, it: true, beforeEach: true */
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

describe('Company interactions controller', function () {
  let company
  const companyinteractioncontroller = require('../../src/controllers/companyinteractioncontroller')

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
  })

  describe('data', function () {
    let res
    let req
    let locals
    beforeEach(function (done) {
      req = {
        session: {}
      }
      res = {
        locals: {
          headingName: 'Freds Company',
          headingAddress: '1234 Road, London, EC1 1AA',
          id: '44332211',
          source: 'company_company',
          company
        },
        render: function (template, options) {
          locals = Object.assign({}, res.locals, options)
          done()
        }
      }
      companyinteractioncontroller.getInteractions(req, res)
    })

    it('should return a list of interactions', function () {
      expect(locals).to.have.property('interactions')
      expect(locals.interactions).to.have.length(2)
    })

    it('should return the required fields for each interaction', function () {
      const interaction = locals.interactions[0]
      expect(interaction.url).to.equal('/interaction/22651151-2149-465e-871b-ac45bc568a62/details')
      expect(interaction.type).to.equal('Email')
      expect(interaction.subject).to.equal('Subject 1234')
      expect(interaction.date).to.equal('14 February 2017')
      expect(interaction.advisor).to.equal('Fred Smith')
    })
    it('should create the alternative url for service deliveries', function () {
      const interaction = locals.interactions[1]
      expect(interaction.url).to.equal('/servicedelivery/22651151-2149-465e-871b-ac45bc568a63/details')
    })

    it('should return a link to add a new interaction', function () {
      expect(locals.addInteractionUrl).to.equal('/interaction/add?company=3f2b2a0f-0eb6-4299-8489-7390ccaa17f5')
    })
  })

  describe('markup', function () {
    let interactions
    let addInteractionUrl

    beforeEach(function () {
      interactions = [{
        url: '/interaction/1/details',
        type: 'Email',
        subject: 'Test subject',
        date: '23 February 2017',
        advisor: 'Fred Smith'
      }, {
        url: '/servicedelivery/2/details',
        type: 'Service Delivery',
        subject: 'Test subject',
        date: '23 February 2017',
        advisor: 'Fred Smith'
      }]

      addInteractionUrl = '/interaction/add?company=1234'
    })

    it('should render a list of interactions', function (done) {
      renderContent({interactions, addInteractionUrl, company})
      .then((document) => {
        expect(document.getElementById('interaction-list')).to.not.be.null
        done()
      })
    })

    it('each un-archived line should include the required data', function (done) {
      renderContent({interactions, addInteractionUrl, company})
      .then((document) => {
        const interactionElement = document.querySelector('#interaction-list .interaction')
        expect(interactionElement.innerHTML).to.include('Test subject')
        expect(interactionElement.innerHTML).to.include('Email')
        expect(interactionElement.innerHTML).to.include('23 February 2017')
        expect(interactionElement.innerHTML).to.include('Fred Smith')
        done()
      })
    })

    it('include a link to add a new interaction', function (done) {
      renderContent({interactions, addInteractionUrl, company})
      .then((document) => {
        const link = document.querySelector('a#add-interaction-link')
        expect(link.href).to.eq('/interaction/add?company=1234')
        done()
      })
    })
    it('should not render interactions if there are none and warn user', function (done) {
      renderContent({interactions: [], addInteractionUrl, company})
      .then((document) => {
        expect(document.getElementById('interaction-list')).to.be.null
        expect(document.querySelector('#no-interaction-warning.infostrip').textContent).to.include('There are no interactions at this time.')
        done()
      })
    })
  })
})

function renderContent (locals) {
  return new Promise((resolve, reject) => {
    const markup = nunjucks.render('../../src/views/company/interactions.html', locals)
    jsdom.env(markup, (err, jsdomWindow) => {
      if (err) {
        reject(err)
      }
      resolve(jsdomWindow.document)
    })
  })
}
