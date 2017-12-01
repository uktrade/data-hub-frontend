const accountManagementData = require('../../../data/interactions/new-interaction.json')
const { assign, set, filter } = require('lodash')
const nock = require('nock')

const config = require('~/config')
const adviserFilters = require('~/src/apps/adviser/filters')

function createMiddleware (saveCompany, filterActiveAdvisers) {
  return proxyquire('~/src/apps/companies/middleware/account-management', {
    '../repos': {
      saveCompany: saveCompany,
    },
    '../../adviser/filters': {
      filterActiveAdvisers: filterActiveAdvisers,
    },
  })
}

describe('Companies account management middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.saveCompanyStub = this.sandbox.stub()
    this.filterActiveAdvisersSpy = this.sandbox.spy(adviserFilters, 'filterActiveAdvisers')
    this.middleware = createMiddleware(this.saveCompanyStub.resolves({ id: '1' }), this.filterActiveAdvisersSpy)

    this.reqMock = {
      session: {
        token: 'efgh',
      },
      flash: this.sandbox.spy(),
      body: assign({}, accountManagementData),
    }

    this.resMock = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {
        company: {
          id: '1',
        },
        returnLink: '/return/',
      },
    }

    this.nextSpy = this.sandbox.spy()

    this.activeInactiveAdviserData = {
      count: 5,
      results: [
        { id: '1', name: 'Jeff Smith', is_active: true },
        { id: '2', name: 'John Smith', is_active: true },
        { id: '3', name: 'Zac Smith', is_active: true },
        { id: '4', name: 'Fred Smith', is_active: false },
        { id: '5', name: 'Jim Smith', is_active: false },
      ],
    }

    // TODO fix this when https://github.com/uktrade/data-hub-frontend/pull/1056 is merged
    nock(config.apiRoot, {
      reqheaders: {
        'Authorization': `Bearer ${this.reqMock.session.token}`,
      },
    })
      .get('/adviser/?limit=100000&offset=0')
      .reply(200, this.activeInactiveAdviserData)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateAccountManagementForm', () => {
    beforeEach(async () => {
      this.currentAdviser = this.activeInactiveAdviserData.results[3]
      set(this.resMock, 'locals.interaction.dit_adviser', this.currentAdviser)

      await this.middleware.populateAccountManagementForm(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should get active advisers and the current adviser', () => {
      expect(this.filterActiveAdvisersSpy).to.be.calledOnce
      expect(this.filterActiveAdvisersSpy).to.be.calledWith({ advisers: this.activeInactiveAdviserData.results })
    })

    it('should set the active advisers', () => {
      const expectedAdvisers = filter(this.activeInactiveAdviserData.results, 'is_active')
      expect(this.resMock.locals.advisers).to.deep.equal(expectedAdvisers)
    })
  })
})
