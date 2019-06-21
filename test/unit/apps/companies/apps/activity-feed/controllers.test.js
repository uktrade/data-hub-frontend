const { renderActivityFeed } = require('~/src/apps/companies/apps/activity-feed/controllers')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder')
const activityFeedEsFixtures = require('~/test/unit/data/activity-feed/activity-feed-from-es')
const companyMock = require('~/test/unit/data/company.json')

describe('Activity feed controllers', () => {
  describe('#fetchActivityFeedHandler', () => {
    beforeEach(() => {
      this.fetchActivityFeedStub = sinon.stub().resolves(activityFeedEsFixtures)

      this.controllers = proxyquire('../../src/apps/companies/apps/activity-feed/controllers', {
        './repos': { fetchActivityFeed: this.fetchActivityFeedStub },
      })
    })

    context('when fetching feed for a company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call fetchActivityFeed with default params', async () => {
        const expectedParams = { companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a', from: 0, token: '1234' }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(activityFeedEsFixtures)
      })
    })

    context('when the endpoint returns error', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 404,
        }
        this.fetchActivityFeedStub.rejects(this.error)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await this.controllers.fetchActivityFeedHandler(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        const expectedParams = { companyId: 'dcdabbc9-1781-e411-8955-e4115bead28a', from: 0, token: '1234' }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.middlewareParameters.resMock.json).to.not.have.been.called
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })

  describe('#renderActivityFeed', () => {
    context('when the feed renders successfully', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })
        await renderActivityFeed(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should render the activity feed template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly('companies/apps/activity-feed/views/container', {
          params: {
            addContentLink: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/interactions/create',
            addContentText: 'Add interaction',
            apiEndpoint: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/activity/data',
          },
        })
      })

      it('should add a breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith(
          'Wonka Industries',
          '/companies/dcdabbc9-1781-e411-8955-e4115bead28a'
        )
        expect(this.middlewareParameters.resMock.breadcrumb.lastCall).to.be.calledWith('Activity Feed')
      })

      it('should not call next with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when viewing the feed for archived company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
        })

        await renderActivityFeed(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render the template without the "Add interaction" button', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly('companies/apps/activity-feed/views/container', {
          params: {
            apiEndpoint: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/activity/data',
          },
        })
      })
    })

    context('when the rendering fails', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        this.error = new Error('Could not render')

        const errorRes = {
          ...this.middlewareParameters.resMock,
          render: () => { throw this.error },
        }

        await renderActivityFeed(
          this.middlewareParameters.reqMock,
          errorRes,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })
})
