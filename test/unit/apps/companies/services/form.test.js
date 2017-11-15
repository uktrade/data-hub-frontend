describe('company form service', function () {
  let companyFormService
  let saveCompanyStub

  beforeEach(function () {
    saveCompanyStub = sinon.stub().resolves({ id: '1234' })

    companyFormService = proxyquire('~/src/apps/companies/services/form', {
      '../repos': {
        saveCompany: saveCompanyStub,
      },
    })
  })

  describe('save', function () {
    it('saves company data to repository', function () {
      const company = {
        thing: 'yes',
        other: 'no',
      }
      return companyFormService.saveCompanyForm('1234', company)
        .then((result) => {
          expect(saveCompanyStub).to.be.called
        })
    })
    it('converts yes/no to true/false', function () {
      const company = {
        thing: 'yes',
        other: 'no',
      }
      return companyFormService.saveCompanyForm('1234', company)
        .then((result) => {
          expect(saveCompanyStub).to.be.calledWith('1234', { thing: true, other: false })
        })
    })
    it('handles errors', function () {
      saveCompanyStub = sinon.stub().rejects({ error: 'test' })
      companyFormService = proxyquire('~/src/apps/companies/services/form', {
        '../repos': {
          saveCompany: saveCompanyStub,
        },
      })
      const company = { thing: '' }

      return companyFormService.saveCompanyForm('1234', company)
        .catch((error) => {
          expect(error).to.deep.equal({ error: 'test' })
        })
    })
  })
})
