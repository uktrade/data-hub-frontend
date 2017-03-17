/* globals expect: true, describe: true, it: true, beforeEach: true */
const companyAddController = require('../../src/controllers/companyaddcontroller')

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}

describe('Company add controller', function () {
  describe('Get step 1', function () {
    it('should return options for company types', function (done) {
      const req = {}
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.ukOtherCompanyOptions).to.deep.equal([
            'Charity',
            'Government department',
            'Intermediary',
            'Limited partnership',
            'Partnership',
            'Sole trader'
          ])
          expect(allOptions.foreignOtherCompanyOptions).to.deep.equal([
            'Charity',
            'Company',
            'Government department',
            'Intermediary',
            'Limited partnership',
            'Partnership',
            'Sole trader'
          ])
          done()
        }
      }

      companyAddController.getAddStepOne(req, res)
    })
    it('should return labels for the types and error messages', function (done) {
      const req = {}
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            forother: 'Foreign organisation'
          })
          expect(allOptions.companyDetailLabels.business_type).to.equal('Business type')
          done()
        }
      }

      companyAddController.getAddStepOne(req, res)
    })
    it('should pass through the request body to show previosuly selected options', function (done) {
      const body = { business_type: '1231231231232' }
      const req = { body }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            forother: 'Foreign organisation'
          })
          expect(allOptions.company).to.deep.equal(body)
          done()
        }
      }

      companyAddController.getAddStepOne(req, res)
    })
  })
  describe('Post step 1', function () {
    describe('forward to next page', function () {
      it('should forward the user to step 2 when adding a uk ltd.', function (done) {
        const req = {
          body: {
            business_type: 'ltd'
          }
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add-step-2/?business_type=ltd&country=uk')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should forward the user to add screen when adding uk other', function (done) {
        const req = {
          body: {
            business_type: 'ukother',
            business_type_uk_other: 'Charity'
          }
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add?business_type=Charity&country=uk')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should forward the user to add screen when adding a foreign company', function (done) {
        const req = {
          body: {
            business_type: 'forother',
            business_type_for_other: 'Charity'
          }
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add?business_type=Charity&country=non-uk')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
    })
    describe('errors', function () {
      it('should show an error when no option selected', function (done) {
        const req = {
          body: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should show an error if other uk selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'ukother'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type_uk_other')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should show an error if foreign selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'forother'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type_for_other')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
    })
  })
})
