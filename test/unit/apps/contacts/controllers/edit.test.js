/* eslint handle-callback-err: 0 */
const { render } = require('~/test/unit/nunjucks')
const { expectTextFieldWithLabel, expectHiddenField, expectRadioWithLabel, expectTextAreaWithLabel } = require('~/test/unit/form-helpers')
const contactLabels = require('~/src/apps/contacts/labels')

describe('Contact controller, edit', function () {
  let contactEditController
  let getDitCompanyStub
  let saveContactFormStub
  let getContactAsFormDataStub
  let company
  const next = function (error) {
    console.log(error)
    throw Error('error')
  }

  beforeEach(function () {
    company = {
      id: '1234',
      name: 'Fred ltd.',
    }

    getDitCompanyStub = sinon.stub().resolves(company)
    getContactAsFormDataStub = sinon.stub().returns({ id: '1234', name: 'Thing' })
    saveContactFormStub = sinon.stub().returns({ id: '1234', first_name: 'Fred', last_name: 'Smith' })

    contactEditController = proxyquire('~/src/apps/contacts/controllers/edit', {
      '../services/form': {
        getContactAsFormData: getContactAsFormDataStub,
        saveContactForm: saveContactFormStub,
      },
      '../../../lib/metadata': {
        countryOptions: [{
          id: '986',
          name: 'United Kingdom',
        }],
      },
      '../../companies/repos': {
        getDitCompany: getDitCompanyStub,
      },
    })
  })

  describe('get', function () {
    describe('existing contact', function () {
      let req
      let res
      let contact

      const next = function (error) {
        throw error
      }

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
        req = {
          session: {
            token: '321',
          },
          query: {},
          params: {
            contactId: '12651151-2149-465e-871b-ac45bc568a62',
          },
        }
        res = {
          locals: {
            contact,
            title: [],
          },
        }
      })

      it('should create a form based on the existing contact', function (done) {
        res.render = function () {
          expect(getContactAsFormDataStub).to.have.been.calledWith(contact)
          expect(res.locals).to.have.property('formData')
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(getDitCompanyStub).to.have.been.calledWith(req.session.token, contact.company.id)
          expect(res.locals.company).to.deep.equal(company)
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
      it('should provide a back link to the contact', function (done) {
        res.render = function () {
          expect(res.locals.backUrl).to.equal('/contact/12651151-2149-465e-871b-ac45bc568a62/details')
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
    })
    describe('new contact for company', function () {
      let req
      let res

      const next = function (error) {
        throw error
      }

      beforeEach(function () {
        req = {
          session: {
            token: '321',
          },
          query: {
            company: '1234',
          },
          params: {},
        }
        res = {
          locals: {
            title: [],
          },
        }
      })

      it('should return a form pre-populated with just the company id', function (done) {
        res.render = function () {
          expect(res.locals.formData).to.deep.equal({ company: company.id })
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(getDitCompanyStub).to.have.been.calledWith(req.session.token, company.id)
          expect(res.locals.company).to.deep.equal(company)
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
      it('should provide a back link to the company', function (done) {
        res.render = function () {
          expect(res.locals.backUrl).to.equal('/company-contacts/1234')
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
    })
    describe('handle editing a form post that produced errors', function () {
      let req
      let body
      let res
      const next = function (error) {
        throw error
      }

      beforeEach(function () {
        body = {
          id: '222',
          first_name: 'Fred',
          last_name: 'Smith',
          company: '1234',
        }
        req = {
          session: {
            token: '321',
          },
          params: {},
          body,
          query: {
            company: '1234',
          },
        }
        res = {
          locals: {
            title: [],
          },
        }
      })
      it('should use the pre posted form for edit', function (done) {
        res.render = function () {
          expect(res.locals.formData).to.deep.equal(body)
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(getDitCompanyStub).to.have.been.calledWith(req.session.token, company.id)
          expect(res.locals.company).to.deep.equal(company)
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
      it('should provide a back link to the company', function (done) {
        res.render = function () {
          expect(res.locals.backUrl).to.equal('/company-contacts/1234')
          done()
        }
        contactEditController.editDetails(req, res, next)
      })
    })
    it('common details', function () {
      it('should include country options for drop down')
      it('should include labels')
      it('should include cross script token')
    })
  })
  describe('render', function () {
    const countryOptions = [{ id: '134', name: 'United Kingdom' }]
    let locals
    beforeEach(function () {
      locals = {
        formData: {
          id: '321',
          company: '1234',
          first_name: 'Fred',
          last_name: 'Smith',
          job_title: 'Director',
          primary: 'yes',
          telephone_countrycode: '+44',
          telephone_number: '123 321',
          email: 'Fred@smith.org',
          address_same_as_company: 'no',
          address_1: 'ad1',
          address_2: 'ad2',
          address_town: 'town',
          address_county: 'county',
          address_postcode: 'SL1',
          address_country: '123',
          telephone_alternative: '33321',
          email_alternative: 'Fred@gmail.com',
          notes: 'some notes',
        },
        countryOptions,
        company,
        contactLabels,
      }
    })
    it('should render all the required fields on the page', function () {
      return render(`${rootPath}/src/views/contact/edit.njk`, locals)
      .then((document) => {
        expect(document.querySelector('[type=hidden][name=id]')).to.not.be.null
        expect(document.querySelector('[type=hidden][name=company][type=hidden]')).to.not.be.null
        expectHiddenField(document, 'id', locals.formData.id)
        expectHiddenField(document, 'company', locals.formData.company)
        expectTextFieldWithLabel(document, 'first_name', 'First name', locals.formData.first_name)
        expectTextFieldWithLabel(document, 'last_name', 'Last name', locals.formData.last_name)
        expectTextFieldWithLabel(document, 'job_title', 'Job Title', locals.formData.job_title)
        expectRadioWithLabel(document, 'primary', 'Is this person a primary contact?', locals.formData.primary)
        expectTextFieldWithLabel(document, 'telephone_countrycode', 'Telephone country code', locals.formData.telephone_countrycode)
        expectTextFieldWithLabel(document, 'telephone_number', 'Telephone', locals.formData.telephone_number)
        expectTextFieldWithLabel(document, 'email', 'Email', locals.formData.email)
        expectRadioWithLabel(document, 'address_same_as_company', 'Is the contact\'s address the same as the company address?', locals.formData.address_same_as_company)
        expectTextFieldWithLabel(document, 'address_1', 'Business and street (optional)', locals.formData.address_1)
        expectTextFieldWithLabel(document, 'address_town', 'Town or city (optional)', locals.formData.address_town)
        expectTextFieldWithLabel(document, 'address_county', 'County (optional)', locals.formData.address_county)
        expectTextFieldWithLabel(document, 'address_postcode', 'Postcode (optional)', locals.formData.address_postcode)
        expectTextFieldWithLabel(document, 'telephone_alternative', 'Alternative phone (optional)', locals.formData.telephone_alternarive)
        expectTextFieldWithLabel(document, 'email_alternative', 'Alternative email (optional)', locals.formData.email_alternative)
        expectTextAreaWithLabel(document, 'notes', 'Notes (optional)', locals.formData.notes)
      })
    })
  })
  describe('save', function () {
    let body
    let flashStub
    let req
    let res

    beforeEach(function () {
      flashStub = sinon.stub()
      res = {
        locals: {},
      }
      req = {
        session: {
          token: '321',
        },
        params: { id: '1234' },
        query: {},
        flash: flashStub,
      }
      body = {
        id: '1234',
        first_name: 'Fred',
        last_name: 'Smith',
        company: '1234',
      }
      req.body = body
    })
    it('should save the form data to the back end', function (done) {
      res.redirect = function () {
        expect(saveContactFormStub).to.be.calledWith(req.session.token, body)
        done()
      }

      contactEditController.postDetails(req, res, next)
    })
    it('should redirect the user to the company contact list if added a new contact', function (done) {
      delete body.id
      res.redirect = function (url) {
        expect(url).to.equal(`/company-contacts/${company.id}`)
        done()
      }
      contactEditController.postDetails(req, res, next)
    })
    it('should redirect the user to the contact detail screen if editing an existing contact', function (done) {
      res.redirect = function (url) {
        expect(url).to.equal('/contact/1234/details')
        done()
      }
      contactEditController.postDetails(req, res, next)
    })
    it('should re-render the edit page with the original form data on validation errors', function (done) {
      saveContactFormStub = sinon.stub().rejects({
        error: { name: ['test'] },
      })

      contactEditController = proxyquire('~/src/apps/contacts/controllers/edit', {
        '../services/form': {
          getContactAsFormData: getContactAsFormDataStub,
          saveContactForm: saveContactFormStub,
        },
        '../../../lib/metadata': {
          countryOptions: [{
            id: '986',
            name: 'United Kingdom',
          }],
        },
        '../../companies/repos': {
          getDitCompany: getDitCompanyStub,
        },
      })

      res.render = function (template) {
        expect(template).to.equal('contact/edit')
        expect(res.locals).to.have.property('errors')
        done()
      }
      contactEditController.postDetails(req, res, next)
    })
    it('should show errors when the save fails for a non-validation related reason', function (done) {
      saveContactFormStub = sinon.stub().rejects(Error('some error'))

      contactEditController = proxyquire('~/src/apps/contacts/controllers/edit', {
        '../services/form': {
          getContactAsFormData: getContactAsFormDataStub,
          saveContactForm: saveContactFormStub,
        },
        '../../../lib/metadata': {
          countryOptions: [{
            id: '986',
            name: 'United Kingdom',
          }],
        },
        '../../companies/repos': {
          getDitCompany: getDitCompanyStub,
        },
      })

      contactEditController.postDetails(req, res, function (error) {
        done()
      })
    })
    it('should send a flash message to let the user know they just updated a contact', function (done) {
      res.redirect = function (url) {
        expect(flashStub).to.be.calledWith('success-message', 'Updated contact record')
        done()
      }
      contactEditController.postDetails(req, res, next)
    })
    it('should send a flash message to let the user know they just added a contact', function (done) {
      delete body.id
      res.redirect = function (url) {
        expect(flashStub).to.be.calledWith('success-message', 'Added new contact')
        done()
      }
      contactEditController.postDetails(req, res, next)
    })
  })
})
