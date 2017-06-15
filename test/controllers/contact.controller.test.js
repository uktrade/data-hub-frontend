const { render } = require('../nunjucks')
const { contactDetailsLabels } = require('~/src/labels/contact-labels')
const next = function (error) { console.log(error) }

describe('Contact controller', function () {
  let getContactStub
  let buildCompanyUrlStub
  let getDisplayContactStub
  let getDitCompanyStub
  let contactController
  let contact
  let contactFormatted
  let company
  let companyUrl
  let token

  beforeEach(function () {
    token = '321'
    company = {
      id: '876544',
      name: 'Bank ltd.',
    }
    companyUrl = '/company/876544'
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
      company,
    }
    contactFormatted = {
      id: '12651151-2149-465e-871b-ac45bc568a62',
      name: 'fred',
    }
    getContactStub = sinon.stub().resolves(contact)
    getDisplayContactStub = sinon.stub().returns(contactFormatted)
    getDitCompanyStub = sinon.stub().resolves(company)
    buildCompanyUrlStub = sinon.stub().returns(companyUrl)
    contactController = proxyquire('~/src/controllers/contact.controller', {
      '../repos/contact.repo': {
        getContact: getContactStub,
      },
      '../services/contact-formatting.service': {
        getDisplayContact: getDisplayContactStub,
      },
      '../repos/company.repo': {
        getDitCompany: getDitCompanyStub,
      },
      '../services/company.service': {
        buildCompanyUrl: buildCompanyUrlStub,
      },
    })
  })

  describe('getCommon', function () {
    it('should get the contacts details', function (done) {
      const req = {
        session: { token },
        params: {
          contactId: '1234',
        },
      }
      const res = {
        locals: {
          title: [],
        },
        render: function () {},
      }
      const next = function () {
        expect(getContactStub).to.have.been.calledWith(token, req.params.contactId)
        done()
      }
      contactController.getCommon(req, res, next)
    })
    it('should include an expanded company', function (done) {
      const req = {
        session: { token },
        params: {
          contactId: '1234',
        },
      }
      const res = {
        locals: {
          contact,
          title: [],
        },
        render: function () {},
      }
      const next = function () {
        expect(getDitCompanyStub).to.have.been.calledWith(token, contact.company.id)
        expect(getContactStub).to.have.been.calledWith(token, req.params.contactId)
        done()
      }
      contactController.getCommon(req, res, next)
    })
    it('should get a link to the contact company', function (done) {
      const req = {
        session: { token },
        params: {
          contactId: '1234',
        },
      }
      const res = {
        locals: {
          company,
          title: [],
        },
        render: function () {},
      }
      const next = function () {
        expect(buildCompanyUrlStub).to.have.been.calledWith(company)
        done()
      }
      contactController.getCommon(req, res, next)
    })
    it('should store the id in locals', function (done) {
      const req = {
        session: { token },
        params: {
          contactId: '1234',
        },
      }
      const res = {
        locals: {
          title: [],
        },
        render: function () {},
      }
      const next = function () {
        expect(res.locals.id).to.equal(req.params.contactId)
        done()
      }
      contactController.getCommon(req, res, next)
    })
    it('should handle an error', function (done) {
      const error = Error('error')
      contactController = proxyquire('~/src/controllers/contact.controller', {
        '../repos/contact.repo': {
          getContact: sinon.stub().rejects(error),
        },
        '../services/contact-formatting.service': {
          getDisplayContact: getDisplayContactStub,
        },
        '../repos/company.repo': {
          getDitCompany: getDitCompanyStub,
        },
        '../services/company.service': {
          buildCompanyUrl: buildCompanyUrlStub,
        },
      })

      const req = {
        session: { token },
        params: {
          contactId: '1234',
        },
      }
      const res = {
        locals: {
          title: [],
        },
        render: function () {},
      }
      const next = function (err) {
        expect(err.message).to.equal(error.message)
        done()
      }

      contactController.getCommon(req, res, next)
    })
  })

  describe('get details', function () {
    describe('data', function () {
      it('should include formatted contact data', function (done) {
        const req = {
          session: {},
        }
        const res = {
          locals: {
            contact,
            company,
            id: '1234',
            title: [],
          },
          render: function (url, options) {
            expect(getDisplayContactStub).to.be.calledWith(contact, company)
            expect(res.locals.contactDetails).to.deep.equal(contactFormatted)
            expect(res.locals.contactDetailsLabels).to.deep.equal(contactDetailsLabels)
            done()
          },
        }
        contactController.getDetails(req, res, next)
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
          notes: 'some notes',
        }
      })

      it('should render a contact details section', function () {
        return render(`${__dirname}/../../src/views/contact/details.njk`, { contact, contactDetails, contactDetailsLabels })
        .then((document) => {
          expect(document.getElementById('contact-details')).to.not.be.null
        })
      })
      it('should include the contact details in a key value table', function () {
        return render(`${__dirname}/../../src/views/contact/details.njk`, { contact, contactDetails, contactDetailsLabels })
        .then((document) => {
          const details = document.getElementById('contact-details')
          expect(details.innerHTML).to.include(contactDetails.title)
          expect(details.innerHTML).to.include(contactDetails.job_title)
          expect(details.innerHTML).to.include(contactDetails.telephone_number)
          expect(details.innerHTML).to.include(contactDetails.email)
          expect(details.innerHTML).to.include(contactDetails.address)
          expect(details.innerHTML).to.include(contactDetails.telephone_alternative)
          expect(details.innerHTML).to.include(contactDetails.email_alternative)
          expect(details.innerHTML).to.include(contactDetails.notes)
        })
      })
      it('should display the contact name and address in a heading', function () {
        return render(`${__dirname}/../../src/views/contact/details.njk`, { contact, contactDetails, contactDetailsLabels })
        .then((document) => {
          const heading = document.querySelector('h2.page-heading')
          expect(heading.innerHTML).to.include('Fred Smith')
          expect(heading.innerHTML).to.include('Bank ltd')
        })
      })
      it('should indicate primary contacts', function () {
        return render(`${__dirname}/../../src/views/contact/details.njk`, { contact, contactDetails, contactDetailsLabels })
        .then((document) => {
          const heading = document.querySelector('h2.page-heading')
          expect(heading.innerHTML).to.include('<span class="status-badge status-badge--fuschia ">Primary</span>')
        })
      })
    })
  })
})
