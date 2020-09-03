const config = require('../../../../config')

describe('Collection middleware', () => {
  beforeEach(() => {
    this.middleware = require('../collection')
    this.reqMock = {
      session: {
        token: '1234',
      },
    }
    this.resMock = {
      locals: {},
    }
    this.nextSpy = sinon.spy()
    this.mockEntityResults = {
      count: 3,
      results: [
        { id: '111', name: 'A' },
        { id: '222', name: 'B' },
        { id: '333', name: 'C' },
      ],
    }
  })

  describe('#getCollection', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/entity`)
        .reply(200, this.mockEntityResults)

      this.reqMock.query = {
        sortby: 'name:asc',
      }
      await this.middleware.getCollection('entity')(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )

      this.actual = this.resMock.locals.results
    })

    it('should set the count', () => {
      expect(this.actual).to.have.property('count')
    })

    it('should set the items', () => {
      expect(this.actual).to.have.property('items').to.have.length(3)
    })

    it('should set the pagination', () => {
      expect(this.actual).to.have.property('pagination')
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
