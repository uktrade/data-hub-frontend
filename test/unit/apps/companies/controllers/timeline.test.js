
const config = require('~/config')
const companyData = require('~/test/unit/data/companies/companies-house-company.json')
const timelineData = require('~/test/unit/data/companies/timeline.json')
const tokenMock = '12345abcde'

const controller = require('~/src/apps/companies/controllers/timeline')

describe('Company timeline controller', () => {
  beforeEach(() => {
    this.breadcrumbStub = sinon.stub().returnsThis()
    this.renderSpy = sinon.spy()
    this.nextSpy = sinon.spy()

    this.reqMock = {
      query: {},
      session: {
        token: tokenMock,
      },
    }

    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        company: companyData,
      },
    }
  })

  context('when timeline api returns valid data', () => {
    context('with default page number', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get('/v3/company/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/timeline?limit=10&offset=0')
          .reply(200, timelineData)

        await controller.renderTimeline(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call timeline with correct arguments', () => {
        expect(nock.isDone()).to.be.true
      })

      it('return a transformed list of entries', () => {
        const transformedTimelineData = this.renderSpy.args[0][1].timeline

        const expected = {
          items: [
            {
              type: 'timeline',
              name: '31 Oct 2018',
              contentMetaModifier: 'stacked',
              meta: [
                {
                  label: 'Source',
                  value: 'Companies House (Companies)',
                },
                {
                  label: 'Description',
                  value: 'Accounts next due date',
                },
              ],
            }, {
              type: 'timeline',
              name: '4 Feb 2017',
              contentMetaModifier: 'stacked',
              meta: [
                {
                  label: 'Source',
                  value: 'Companies House (Companies)',
                },
                {
                  label: 'Description',
                  value: 'Returns next due date',
                },
              ],
            },
            {
              type: 'timeline',
              name: '31 Jan 2017',
              contentMetaModifier: 'stacked',
              meta: [
                {
                  label: 'Source',
                  value: 'Companies House (Companies)',
                },
                {
                  label: 'Description',
                  value: 'Accounts last made up date',
                },
              ],
            },
            {
              type: 'timeline',
              name: '7 Jan 2016',
              contentMetaModifier: 'stacked',
              meta: [
                {
                  label: 'Source',
                  value: 'Companies House (Companies)',
                },
                {
                  label: 'Description',
                  value: 'Returns last due date',
                },
              ],
            },
            {
              type: 'timeline',
              name: '7 Jan 2002',
              contentMetaModifier: 'stacked',
              meta: [
                {
                  label: 'Source',
                  value: 'Companies House (Companies)',
                },
                {
                  label: 'Description',
                  value: 'Company officially incorporated in Companies House',
                },
              ],
            },
          ],
          'count': 5,
          'pagination': null,
        }

        expect(transformedTimelineData).to.deep.equal(expected)
      })

      it('should set the breadcrumbs', () => {
        expect(this.breadcrumbStub).to.have.been.calledTwice
        expect(this.breadcrumbStub).to.have.been.calledWith('SAMSUNG BIOEPIS UK LIMITED', '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4')
        expect(this.breadcrumbStub).to.have.been.calledWith('Timeline')
      })

      it('should render the correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('companies/views/timeline')
        expect(this.renderSpy).to.have.been.calledOnce
      })
    })

    context('when a custom page number', () => {
      beforeEach(async () => {
        this.reqMock.query.page = 2

        nock(config.apiRoot)
          .get('/v3/company/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/timeline?limit=10&offset=10')
          .reply(200, timelineData)

        await controller.renderTimeline(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call timeline with correct arguments', () => {
        expect(nock.isDone()).to.be.true
      })
    })
  })

  context('when timeline api returns error', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v3/company/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/timeline?limit=10&offset=0')
        .reply(500)

      await controller.renderTimeline(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should call next with error', () => {
      expect(this.nextSpy).to.have.been.calledOnce
      expect(this.nextSpy.firstCall.args).to.have.length(1)
    })
  })
})
