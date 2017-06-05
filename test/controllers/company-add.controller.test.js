const next = function (error) {
  throw Error(error)
}

describe('Company add controller', function () {
  let searchLimitedStub
  let getCompanyForSourceStub
  let getDisplayCHStub
  let companyAddController

  beforeEach(function () {
    searchLimitedStub = sinon.stub().resolves([
      {
        _type: 'company_company',
        _source: {
          id: '1234',
          company_number: '123123',
          name: 'freds',
        },
      },
    ])

    getCompanyForSourceStub = sinon.stub().resolves({ id: '9999', company_number: '8888' })
    getDisplayCHStub = sinon.stub().resolves({ id: '1234' })

    companyAddController = proxyquire('~/src/controllers/company-add.controller', {
      '../services/search.service': {
        searchLimited: searchLimitedStub,
      },
      '../services/company.service': {
        getCompanyForSource: getCompanyForSourceStub,
      },
      '../services/company-formatting.service': {
        getDisplayCH: getDisplayCHStub,
      },
    })
  })

  describe('Get step 1', function () {
    it('should return options for company types', function (done) {
      const req = { session: {} }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.ukOtherCompanyOptions).to.deep.equal([
            'Charity',
            'Government dept',
            'Intermediary',
            'Limited partnership',
            'Partnership',
            'Sole trader',
          ])
          expect(allOptions.foreignOtherCompanyOptions).to.deep.equal([
            'Charity',
            'Company',
            'Government dept',
            'Intermediary',
            'Limited partnership',
            'Partnership',
            'Sole trader',
          ])
          done()
        },
      }

      companyAddController.getAddStepOne(req, res, next)
    })
    it('should return labels for the types and error messages', function (done) {
      const req = { session: {} }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            foreign: 'Foreign organisation',
          })
          expect(allOptions.companyDetailsLabels.business_type).to.equal('Business type')
          done()
        },
      }

      companyAddController.getAddStepOne(req, res, next)
    })
    it('should pass through the request body to show previosuly selected options', function (done) {
      const body = { business_type: '1231231231232' }
      const req = { body, session: {} }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            foreign: 'Foreign organisation',
          })
          expect(allOptions.company).to.deep.equal(body)
          done()
        },
      }

      companyAddController.getAddStepOne(req, res, next)
    })
  })
  describe('Post step 1', function () {
    describe('forward to next page', function () {
      it('should forward the user to step 2 when adding a uk ltd.', function (done) {
        const req = {
          body: {
            business_type: 'ltd',
          },
          session: {},
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add-step-2/?business_type=ltd&country=uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should forward the user to add screen when adding uk other', function (done) {
        const req = {
          body: {
            business_type: 'ukother',
            business_type_uk_other: 'Charity',
          },
          session: {},
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add/ukother?business_type=Charity&country=uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should forward the user to add screen when adding a foreign company', function (done) {
        const req = {
          body: {
            business_type: 'foreign',
            business_type_for_other: 'Charity',
          },
          session: {},
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add/foreign?business_type=Charity&country=non-uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
    })
    describe('errors', function () {
      it('should show an error when no option selected', function (done) {
        const req = {
          body: {},
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should show an error if other uk selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'ukother',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type_uk_other')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should show an error if foreign selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'foreign',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type_for_other')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
    })
  })
  describe('Get step 2', function () {
    describe('show initial page', function () {
      it('should render the correct page', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
            country: 'uk',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(template).to.equal('company/add-step-2.njk')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should pass the company type labels', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
            country: 'uk',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.companyTypeOptions).to.deep.equal({
              ltd: 'UK private or public limited company',
              ltdchild: 'Child of a UK private or public limited company',
              ukother: 'Other type of UK organisation',
              foreign: 'Foreign organisation',
            })
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should pass through the query variables', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
            country: 'uk',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.business_type).to.equal('ltd')
            expect(allOptions.country).to.equal('uk')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
    })
    describe('show when search term entered', function () {
      it('should search for the company name entered', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(searchLimitedStub).to.be.calledWith('1234', 'test')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include parsed search results in page', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            const hit = allOptions.hits[0]
            expect(hit.type).to.equal('company_company')
            expect(hit.url).to.include('selected=1234')
            expect(hit.name).to.equal('freds')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include business information after search in page when selected is blank', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.business_type).to.equal('ltd')
            expect(allOptions.country).to.equal('uk')
            expect(allOptions.term).to.equal('test')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include business information after search in page when selected has a value', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '9999',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.business_type).to.equal('ltd')
            expect(allOptions.country).to.equal('uk')
            expect(allOptions.term).to.equal('test')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
    })
    describe('show when a company is selected', function () {
      it('should fetch the ch company', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '9999',
            type: 'company_company',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(getCompanyForSourceStub).to.be.calledWith('1234', '9999', 'company_company')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should parse the CH details for display', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(getDisplayCHStub).to.have.been.called
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include labels and display order for the table', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.chDetailsLabels).to.deep.equal({
              name: 'Registered name',
              company_number: 'Companies House No',
              registered_address: 'Registered office address',
              business_type: 'Company type',
              company_status: 'Company status',
              sic_code: 'Nature of business (SIC)',
              incorporation_date: 'Incorporated on',
            })
            expect(allOptions.chDetailsDisplayOrder).to.deep.equal(['business_type', 'company_status', 'incorporation_date', 'sic_code'])
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include a link to close the selected section', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.closeLink).to.not.include('selected')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should provide a link to edit a DIT company record if one exists', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company',
          },
        }

        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.addLink).to.deep.equal({
              label: 'Go to company record',
              url: `/company/edit/ltd/9999`,
            })
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should provide a link to add a new DIT company record for a companies house entry', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_companieshousecompany',
          },
        }

        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.addLink).to.deep.equal({
              label: 'Choose company',
              url: `/company/add/ltd/8888`,
            })
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
