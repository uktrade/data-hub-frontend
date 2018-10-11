const { streamToFile } = require('~/src/lib/stream-to-file')

describe('#streamToFile', () => {
  context('when streaming from the remote api', () => {
    beforeEach(() => {
      this.attachmentStub = sinon.spy()
      this.typeStub = sinon.spy()
      this.pipeStub = sinon.spy()

      this.resMock = {
        attachment: this.attachmentStub,
        type: this.typeStub,
      }

      this.reqMock = {
        pipe: this.pipeStub,
      }

      streamToFile(this.reqMock, this.resMock, 'test-filename.csv', 'mime/test')
    })

    it('sets the attachment filename', () => {
      expect(this.attachmentStub).to.calledWith('test-filename.csv')
    })

    it('sets the attachment type', () => {
      expect(this.typeStub).to.calledWith('mime/test')
    })

    it('pipes the response', () => {
      expect(this.pipeStub).to.be.calledWith(this.resMock)
    })
  })
})
