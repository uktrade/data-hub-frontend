const config = require('~/config')

describe('Collection middleware', () => {
  context('#collectionExport', () => {
    beforeEach(() => {
      const streamToFileStub = sinon.spy()
      const { exportCollection } = proxyquire('~/src/modules/search/middleware/collection', {
        '../../../lib/stream-to-file': {
          streamToFile: streamToFileStub,
        },
      })
      this.exportCollection = exportCollection
      this.streamToFileStub = streamToFileStub

      this.reqMock = {
        session: {
          token: '1234',
        },
      }

      this.resMock = sinon.spy()
      this.nextSpy = sinon.spy()
    })

    describe('#exportCollection', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v3/search/entity/export`)
          .reply(200, this.resMock)

        this.reqMock.query = {
          sortby: 'name:asc',
        }
        await this.exportCollection('entity', 'test-file')(this.reqMock, this.resMock, this.nextSpy).catch(e => { throw e })
      })

      it('should set the attachment filename', () => {
        expect(this.streamToFileStub.args[0][2]).to.equal('test-file.csv')
      })

      it('should pass the response to the file streamer', () => {
        expect(this.streamToFileStub).to.be.calledOnce
        expect(this.streamToFileStub.args[0][1]).to.equal(this.resMock)
      })

      it('should not return an error to the next handler', () => {
        expect(this.nextSpy).to.not.be.called
      })
    })
  })
})
