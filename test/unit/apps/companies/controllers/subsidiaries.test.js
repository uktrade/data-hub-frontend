const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/config')
const { renderSubsidiaries } = require('~/src/apps/companies/controllers/subsidiaries')

const companyMock = require('~/test/unit/data/companies/companies-house-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const subsidiariesMock = require('~/test/unit/data/companies/subsidiaries.json')

describe('company subsidiaries controller', () => {
  context('when there are subsidiaries to list', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=72fda78f-bdc3-44dc-9c22-c8ac82f7bda4')
        .reply(200, subsidiariesMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    it('should return the subsidiaries as a collection', () => {
      expect(this.subsidiaries).to.have.property('items')
      expect(this.subsidiaries).to.have.property('count', 1)
    })

    it('should return no pagination data', () => {
      expect(this.subsidiaries).to.have.property('pagination', null)
    })

    it('should transform each subsidiary for display', () => {
      const subsidiary = this.subsidiaries.items[0]

      expect(subsidiary).to.deep.equal({
        id: '0f5216e0-849f-11e6-ae22-56b6b6499611',
        name: 'Venus Ltd',
        url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
        meta: [
          { label: 'Sector', value: 'Retail' },
          { label: 'Country', type: 'badge', value: 'United Kingdom' },
          { label: 'UK region', type: 'badge', value: 'North West' },
          { label: '', value: 'Remove subsidiary', url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611/hierarchies/ghq/remove' },
          { label: 'Primary address', value: '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom' },
        ],
        subTitle: {
          type: 'datetime',
          value: '2018-05-29T13:15:47.200952Z',
          label: 'Updated on',
        },
        type: 'company',
      })
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([{
        label: 'Link a subsidiary',
        url: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/subsidiaries/link',
      }])
    })

    it('should include a count label', () => {
      expect(this.subsidiaries).to.have.property('countLabel', 'subsidiary')
    })
  })

  context('when the company is Dun and Bradstreet', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${dnbCompanyMock.id}`)
        .reply(200, dnbCompanyMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: dnbCompanyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should not set actions buttons', () => {
      const props = this.middlewareParameters.resMock.render.args[0][1]

      expect(props.actionButtons).to.be.undefined
    })
  })

  context('when the company is archived', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`)
        .reply(200, companyMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: {
          ...companyMock,
          archived: true,
        },
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should not set actions buttons', () => {
      const props = this.middlewareParameters.resMock.render.args[0][1]

      expect(props.actionButtons).to.be.undefined
    })
  })

  context('when there are no subsidiaries', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`)
        .reply(200, {
          count: 0,
          next: null,
          previous: null,
          results: [],
        })

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    it('should return the subsidiaries as a collection', () => {
      expect(this.subsidiaries).to.have.property('items')
      expect(this.subsidiaries).to.have.property('count', 0)
    })

    it('should return no pagination data', () => {
      expect(this.subsidiaries).to.have.property('pagination', null)
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([{
        label: 'Link a subsidiary',
        url: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/subsidiaries/link',
      }])
    })

    it('should include a count label', () => {
      expect(this.subsidiaries).to.have.property('countLabel', 'subsidiary')
    })
  })

  context('when requesting page 2 of a large collection', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/company?limit=10&offset=10&sortby=name&global_headquarters_id=${companyMock.id}`)
        .reply(200, {
          ...subsidiariesMock,
          count: 50,
        })

      this.middlewareParameters = buildMiddlewareParameters({
        requestQuery: {
          page: 2,
        },
        company: companyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    it('should return the subsidiaries as a collection', () => {
      expect(this.subsidiaries).to.have.property('items')
      expect(this.subsidiaries).to.have.property('count', 50)
    })

    it('should return pagination data', () => {
      const pagination = this.subsidiaries.pagination

      expect(pagination).to.have.property('currentPage', 2)
      expect(pagination).to.have.property('totalPages', 5)
      expect(pagination.pages).to.have.length(5)
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([{
        label: 'Link a subsidiary',
        url: `/companies/${companyMock.id}/subsidiaries/link`,
      }])
    })

    it('should include a count label', () => {
      expect(this.subsidiaries).to.have.property('countLabel', 'subsidiary')
    })
  })
})
