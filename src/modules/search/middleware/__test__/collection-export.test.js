const config = require('../../../../config')

describe('Collection middleware', () => {
  context('#collectionExport', () => {
    beforeEach(() => {
      const { exportCollection } = require('../collection')
      this.exportCollection = exportCollection

      this.reqMock = {
        session: {
          token: '1234',
        },
      }

      this.resMock = {
        on: sinon.spy(),
        // these are required otherwise request doesn't see the mock as a stream
        end: () => {},
        emit: () => {},
        removeListener: () => {},
      }

      this.nextSpy = sinon.spy()
    })

    describe('#exportCollection', () => {
      beforeEach(async () => {
        nock(config.apiRoot).post(`/v3/search/entity/export`).reply(200)

        this.reqMock.query = {
          sortby: 'name:asc',
        }
        await this.exportCollection('entity')(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should pipe the request to response as a stream', () => {
        expect(this.resMock.on).to.be.called
      })

      it('should not return an error to the next handler', () => {
        expect(this.nextSpy).to.not.be.called
      })
    })
  })
})
