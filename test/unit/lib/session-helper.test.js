const { assign } = require('lodash')

const sessionHelper = require('src/lib/session-helper')

describe('#saveSession', () => {
  beforeEach(() => {
    this.saveSession = sinon.spy(sessionHelper, 'saveSession')
    this.reqMock = assign({}, globalReq, {
      session: {
        save: sinon.stub(),
      },
    })
  })

  context('session save success', () => {
    beforeEach(async () => {
      this.reqMock.session.save.yields()
      await this.saveSession(this.reqMock.session)
    })

    it('should call saveSession', () => {
      expect(this.saveSession).to.have.been.calledOnce
    })

    it('should call session save method', () => {
      expect(this.reqMock.session.save).to.have.been.calledOnce
    })
  })

  context('session save error', () => {
    beforeEach(async () => {
      this.returnedError = 'huston we have a problem!'
      this.reqMock.session.save.yields(this.returnedError)
      try {
        await this.saveSession(this.reqMock.session)
      } catch (error) {
        this.error = error
      }
    })

    it('should call saveSession', () => {
      expect(this.saveSession).to.have.been.calledOnce
    })

    it('should call session save method', () => {
      expect(this.reqMock.session.save).to.have.been.calledOnce
    })

    it('should handle error as expected', () => {
      expect(this.error).to.equal(this.returnedError)
    })
  })
})
