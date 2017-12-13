const companyMock = require('~/test/unit/data/api-response-intermediary-company.json')
const { assign } = require('lodash')

describe('Company export controller', () => {
  beforeEach(() => {
    this.saveCompany = sandbox.stub()
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.renderSpy = sandbox.spy()
    this.nextSpy = sandbox.spy()
    this.redirectSpy = sandbox.spy()

    const ukOtherCompanyOptions = [
      {
        value: '9dd14e94-5d95-e211-a939-e4115bead28a',
        label: 'Charity',
      },
      {
        value: '9cd14e94-5d95-e211-a939-e4115bead28a',
        label: 'Government Dept',
      },
      {
        value: '9bd14e94-5d95-e211-a939-e4115bead28a',
        label: 'Intermediary',
      },
      {
        value: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
        label: 'Limited partnership',
      },
      { value: '9ad14e94-5d95-e211-a939-e4115bead28a',
        label: 'Partnership',
      },
      {
        value: '6f75408b-03e7-e611-bca1-e4115bead28a',
        label: 'Private limited company',
      },
      {
        value: 'dac8c591-03e7-e611-bca1-e4115bead28a',
        label: 'Public limited company',
      },
      {
        value: '99d14e94-5d95-e211-a939-e4115bead28a',
        label: 'Sole Trader',
      },
    ]
    const foreignOtherCompanyOptions = ukOtherCompanyOptions.concat([{
      value: '98d14e94-5d95-e211-a939-e4115bead28a',
      label: 'Company',
    }])

    this.controller = proxyquire('~/src/apps/companies/controllers/edit', {
      '../options': {
        buildUkOtherCompanyOptions: () => ukOtherCompanyOptions,
        buildForeignOtherCompanyOptions: () => foreignOtherCompanyOptions,
      },
    })

    this.buildReq = extra => assign({}, extra)
    this.buildRes = extra => assign(
      {
        breadcrumb: this.breadcrumbStub,
        render: this.renderSpy,
        redirect: this.redirectSpy,
        locals: {
          company: companyMock,
        },
      },
      extra
    )

    this.reqMock = this.buildReq({})
    this.resMock = this.buildRes({})
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getBusinessTypeLabel()', () => {
    it('should handle UK limited company', () => {
      const label = this.controller.getBusinessTypeLabel('limited company', false, null)
      expect(label).to.equal('UK limited company')
    })

    it('should handle UK charity', () => {
      const uuid = '9dd14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, false, uuid)
      expect(label).to.equal('UK Charity')
    })

    it('should handle UK government department', () => {
      const uuid = '9cd14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, false, uuid)
      expect(label).to.equal('UK Government Dept')
    })

    it('should handle UK Intermediary', () => {
      const uuid = '9bd14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, false, uuid)
      expect(label).to.equal('UK Intermediary')
    })

    it('should handle UK Limited partnership', () => {
      const uuid = '8b6eaf7e-03e7-e611-bca1-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, false, uuid)
      expect(label).to.equal('UK Limited partnership')
    })

    it('should handle UK Partnership', () => {
      const uuid = '9ad14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, false, uuid)
      expect(label).to.equal('UK Partnership')
    })

    it('should handle UK Sole trader', () => {
      const uuid = '99d14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, false, uuid)
      expect(label).to.equal('UK Sole Trader')
    })

    it('should handle Foreign charity', () => {
      const uuid = '9dd14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Charity')
    })

    it('should handle Foreign government department', () => {
      const uuid = '9cd14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Government Dept')
    })

    it('should handle Foreign Intermediary', () => {
      const uuid = '9bd14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Intermediary')
    })

    it('should handle Foreign Limited partnership', () => {
      const uuid = '8b6eaf7e-03e7-e611-bca1-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Limited partnership')
    })

    it('should handle Foreign Partnership', () => {
      const uuid = '9ad14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Partnership')
    })

    it('should handle Foreign Sole trader', () => {
      const uuid = '99d14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Sole Trader')
    })

    it('should handle Foreign Company', () => {
      const uuid = '98d14e94-5d95-e211-a939-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal('Foreign Company')
    })

    it('should handle unrecognised uuids', () => {
      const uuid = '98d14e94-milk-eggs-beef-e4115bead28a'
      const label = this.controller.getBusinessTypeLabel(undefined, true, uuid)
      expect(label).to.equal(undefined)
    })
  })

  describe('renderForm', () => {
    it('should treat non-uk company as foreign', () => {
      const reqMock = this.buildReq({ query: { country: 'non-uk' } })
      const resMock = this.buildRes({
        locals: {},
      })
      this.controller.renderForm(reqMock, resMock, this.nextSpy)
      expect(this.renderSpy.args[0][1].isForeign).to.equal(true)
    })

    it('should treat uk company based overseas as foreign', () => {
      const reqMock = this.buildReq({ query: {} })
      const resMock = this.buildRes({
        locals: {
          company: { 'uk_based': false },
          businessType: '9ad14e94-5d95-e211-a939-e4115bead28a',
        },
        companiesHouseRecord: { country: 'fr' },
      })
      this.controller.renderForm(reqMock, resMock, this.nextSpy)
      expect(this.renderSpy.args[0][1].isForeign).to.equal(true)
    })

    it('should treat uk company based in the UK is domestic', () => {
      const reqMock = this.buildReq({ query: {} })
      const resMock = this.buildRes({
        locals: {
          company: { 'uk_based': true },
        },
      })
      this.controller.renderForm(reqMock, resMock, this.nextSpy)
      expect(this.renderSpy.args[0][1].isForeign).to.equal(false)
    })

    it('should expose businessTypeLabel', () => {
      const reqMock = this.buildReq({ query: {} })
      const resMock = this.buildRes({
        locals: {
          companiesHouseCategory: 'limited company',
        },
      })
      this.controller.renderForm(reqMock, resMock, this.nextSpy)
      expect(this.renderSpy.args[0][1].businessTypeLabel).to.equal('UK limited company')
    })
  })
})
